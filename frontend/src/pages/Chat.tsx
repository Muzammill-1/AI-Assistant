import { AssistantRuntimeProvider } from "@assistant-ui/react";

import { Thread } from "@/components/thread.aui";
import { useAIRuntime } from "@/runtime/ai-runtime";

export function Chat() {
  const runtime = useAIRuntime();

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread />
    </AssistantRuntimeProvider>
  );
}