import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const assistantId = process.env.ASSISTANT_ID;

async function createThread() {
  try {
    const thread = await openai.beta.threads.create();
    return thread.id;
  } catch (error) {
    console.error("Error creating thread:", error);
    throw new Error("Failed to create thread.");
  }
}

async function createMessage(threadId, userMessage) {
  try {
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: userMessage,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    throw new Error("Failed to create message.");
  }
}

async function runAssistant(threadId) {
  try {
    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId,
    });
    return run;
  } catch (error) {
    console.error("Error running assistant:", error);
    throw new Error("Failed to run assistant.");
  }
}

async function getAssistantResponse(threadId, userMessage) {
  try {
    const messages = await openai.beta.threads.messages.list(threadId);

    const assistantMessage = messages.data.find((message) => message.role === "assistant");

    if (assistantMessage) {
      let content = assistantMessage.content.map((c) => c.text?.value || "").join("\n");
      return { message: content };
    } else {
      throw new Error("No assistant messages found.");
    }
  } catch (error) {
    console.error("Error retrieving assistant response:", error);
    throw new Error("Failed to retrieve messages. The error has been logged. Please try again.");
  }
}

export async function POST(request) {
  try {
    const json = await request.json();
    const userMessage = json?.message;
    let threadId = json?.thread_id;

    if (!userMessage) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (!threadId) {
      threadId = await createThread();
    }

    await createMessage(threadId, userMessage);

    const run = await runAssistant(threadId);

    if (run.status === "completed") {
      const responseObject = await getAssistantResponse(threadId, userMessage);
      const { message: responseMessage } = responseObject;

      return NextResponse.json({
        thread_id: threadId,
        message: responseMessage,
      });
    } else {
      return NextResponse.json({ error: `Assistant run status: ${run.status}` }, { status: 500 });
    }
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
