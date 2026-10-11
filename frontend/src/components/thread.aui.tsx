"use client";

import {
  ComposerAddAttachment,
  ComposerAttachments,
  UserMessageAttachments,
} from "@/components/assistant-ui/elements/attachment.aui";
import { File } from "@/components/file";
import { ThreadFollowupSuggestions } from "@/components/assistant-ui/elements/follow-up-suggestions.aui";
import { Image } from "@/components/image";
import { MarkdownText } from "@/components/markdown-text";
import {
  Reasoning,
  ReasoningContent,
  ReasoningRoot,
  ReasoningText,
  ReasoningTrigger,
} from "@/components/assistant-ui/elements/reasoning.aui";
import { ToolFallback } from "@/components/assistant-ui/elements/tool-fallback.aui";
import {
  ToolGroupContent,
  ToolGroupRoot,
  ToolGroupTrigger,
} from "@/components/assistant-ui/elements/tool-group.aui";
import { TooltipIconButton } from "@/components/tooltip-icon-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ActionBarMorePrimitive,
  ActionBarPrimitive,
  AuiIf,
  type AssistantState,
  BranchPickerPrimitive,
  ComposerPrimitive,
  ErrorPrimitive,
  groupPartByType,
  MessagePrimitive,
  SuggestionPrimitive,
  ThreadPrimitive,
  type FileMessagePartComponent,
  type ImageMessagePartComponent,
  type TextMessagePartComponent,
  type ToolCallMessagePartComponent,
  useAuiState,
} from "@assistant-ui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  AudioLinesIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  DownloadIcon,
  FileCode2Icon,
  FolderGit2Icon,
  LightbulbIcon,
  MicIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PhoneIcon,
  RefreshCwIcon,
  SparklesIcon,
  SquareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  WrenchIcon,
} from "lucide-react";
import {
  createContext,
  useContext,
  type ComponentType,
  type FC,
  type PropsWithChildren,
  type ReactNode,
} from "react";

export type ThreadGroupPart = MessagePrimitive.GroupedParts.GroupPart;

export type ThreadComponents = {
  AssistantMessage?: ComponentType | undefined;
  Welcome?: ComponentType | undefined;
  ToolFallback?: ToolCallMessagePartComponent | undefined;
  ToolGroup?:
    | ComponentType<PropsWithChildren<{ group: ThreadGroupPart }>>
    | undefined;
  ReasoningGroup?:
    | ComponentType<PropsWithChildren<{ group: ThreadGroupPart }>>
    | undefined;
  TaskGroup?: ComponentType<{ group: ThreadGroupPart }> | undefined;
};

const messageGroupBy = groupPartByType({
  reasoning: ["group-chainOfThought", "group-reasoning"],
  "tool-call": ["group-chainOfThought", "group-tool"],
  "standalone-tool-call": [],
});

type ThreadGroupKey =
  | "group-chainOfThought"
  | "group-reasoning"
  | "group-tool"
  | "group-task";

const TASK_GROUP_PATH: readonly ThreadGroupKey[] = [
  "group-chainOfThought",
  "group-task",
];

const taskAwareGroupBy = (
  part: Parameters<typeof messageGroupBy>[0],
  context?: Parameters<typeof messageGroupBy>[1],
): readonly ThreadGroupKey[] => {
  const path = messageGroupBy(part, context);

  return part.type === "tool-call" &&
    part.messages !== undefined &&
    path.length > 0 &&
    !context?.toolUIs?.[part.toolName]?.length
    ? TASK_GROUP_PATH
    : path;
};

export type ThreadProps = {
  components?: ThreadComponents | undefined;
  autoFocus?: boolean | undefined;
};

const EMPTY_COMPONENTS: ThreadComponents = {};

const ThreadComponentsContext =
  createContext<ThreadComponents>(EMPTY_COMPONENTS);

const isNewChatView = (s: AssistantState) =>
  s.thread.messages.length === 0 &&
  (!s.thread.isLoading || s.threads.isLoading);

const isHistoryLoadingView = (s: AssistantState) =>
  s.thread.messages.length === 0 &&
  s.thread.isLoading &&
  !s.thread.isDisabled &&
  !s.threads.isLoading;

const ThreadHistorySkeleton: FC = () => (
  <div
    data-slot="aui_thread-history-skeleton"
    role="status"
    className="mx-auto flex w-full max-w-(--thread-max-width) flex-col gap-8 px-4 py-8 sm:px-5 md:px-6"
  >
    <span className="sr-only">Loading conversation</span>

    <div className="ml-auto w-full max-w-md space-y-2">
      <Skeleton className="ml-auto h-11 w-3/4 rounded-2xl motion-reduce:animate-none" />
    </div>

    <div className="flex max-w-2xl flex-col gap-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-7 rounded-lg motion-reduce:animate-none" />
        <Skeleton className="h-3 w-24 motion-reduce:animate-none" />
      </div>

      <Skeleton className="h-4 w-full motion-reduce:animate-none" />
      <Skeleton className="h-4 w-11/12 motion-reduce:animate-none" />
      <Skeleton className="h-4 w-3/5 motion-reduce:animate-none" />
    </div>

    <div className="ml-auto w-full max-w-sm">
      <Skeleton className="ml-auto h-11 w-2/3 rounded-2xl motion-reduce:animate-none" />
    </div>

    <div className="flex max-w-xl flex-col gap-3">
      <Skeleton className="h-4 w-10/12 motion-reduce:animate-none" />
      <Skeleton className="h-4 w-2/3 motion-reduce:animate-none" />
    </div>
  </div>
);

export const Thread: FC<ThreadProps> = ({
  components = EMPTY_COMPONENTS,
  autoFocus = true,
}) => {
  const isEmpty = useAuiState(isNewChatView);

  return (
    <ThreadComponentsContext.Provider value={components}>
      <ThreadRoot isEmpty={isEmpty} autoFocus={autoFocus} />
    </ThreadComponentsContext.Provider>
  );
};

const ThreadRoot: FC<{ isEmpty: boolean; autoFocus: boolean }> = ({
  isEmpty,
  autoFocus,
}) => {
  const { Welcome = ThreadWelcome } = useContext(ThreadComponentsContext);

  return (
    <ThreadPrimitive.Root
      className="aui-root aui-thread-root bg-background @container flex h-full min-h-0 flex-col"
      style={{
        ["--thread-max-width" as string]: "48rem",
        ["--composer-bg" as string]:
          "color-mix(in oklab, var(--color-muted) 35%, transparent)",
        ["--composer-radius" as string]: "1rem",
        ["--composer-padding" as string]: "8px",
      }}
    >
      <ThreadPrimitive.Viewport
        turnAnchor="top"
        data-slot="aui_thread-viewport"
        className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto scroll-smooth"
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-(--thread-max-width) flex-1 flex-col px-4 pt-6 sm:px-5 md:px-6",
            isEmpty && "justify-center",
          )}
        >
          <AuiIf condition={isNewChatView}>
            <Welcome />
          </AuiIf>

          <AuiIf condition={isHistoryLoadingView}>
            <ThreadHistorySkeleton />
          </AuiIf>

          <div
            data-slot="aui_message-group"
            className="mb-14 flex flex-col gap-y-8 empty:hidden"
          >
            <ThreadPrimitive.Messages>
              {() => <ThreadMessage />}
            </ThreadPrimitive.Messages>
          </div>

          <ThreadPrimitive.ViewportFooter
            className={cn(
              "aui-thread-viewport-footer bg-background flex flex-col gap-3 overflow-visible pb-4 md:pb-6",
              !isEmpty &&
                "sticky bottom-0 mt-auto rounded-t-[var(--composer-radius)]",
            )}
          >
            <ThreadScrollToBottom />

            <ThreadFollowupSuggestions />

            <Composer autoFocus={autoFocus} />

            <AuiIf condition={(s) => isNewChatView(s) && s.composer.isEmpty}>
              <ThreadSuggestions />
            </AuiIf>
          </ThreadPrimitive.ViewportFooter>
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const ThreadMessage: FC = () => {
  const { AssistantMessage: AssistantMessageComponent = AssistantMessage } =
    useContext(ThreadComponentsContext);

  const role = useAuiState((s) => s.message.role);
  const isEditing = useAuiState((s) => s.message.composer.isEditing);
  const isSpoken = useAuiState((s) => s.message.metadata.modality === "voice");

  if (isEditing) return <EditComposer />;
  if (isSpoken) return <SpokenMessage />;
  if (role === "user") return <UserMessage />;

  return <AssistantMessageComponent />;
};

type VoiceRunPosition = "single" | "start" | "middle" | "end";

const useVoiceRunPosition = (): VoiceRunPosition =>
  useAuiState((s) => {
    const before =
      s.thread.messages[s.message.index - 1]?.metadata.modality === "voice";

    const after =
      s.thread.messages[s.message.index + 1]?.metadata.modality === "voice";

    if (before) return after ? "middle" : "end";

    return after ? "start" : "single";
  });

const SpokenText: TextMessagePartComponent = ({ text }) => (
  <p className="m-0">{text}</p>
);

const SpokenMessage: FC = () => {
  const role = useAuiState((s) => s.message.role);
  const position = useVoiceRunPosition();

  const isSpeaking = useAuiState(
    (s) =>
      s.message.role === "assistant" &&
      s.message.status?.type === "running",
  );

  const opensExchange = position === "start" || position === "single";

  return (
    <MessagePrimitive.Root
      data-slot="aui_spoken-message-root"
      data-role={role}
      data-voice-run={position}
      className={cn(
        "aui-spoken-message mx-2 bg-muted/40 px-3 py-2 [contain-intrinsic-size:auto_48px] [content-visibility:auto]",
        position === "single" && "rounded-xl",
        position === "start" && "rounded-t-xl pt-2",
        position === "middle" && "-mt-6",
        position === "end" && "-mt-6 rounded-b-xl pb-2",
      )}
    >
      {opensExchange && (
        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <PhoneIcon className="size-3" aria-hidden />
          <span>Voice conversation</span>
        </div>
      )}

      <div className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
        <span className="mt-1 shrink-0 text-muted-foreground" aria-hidden>
          {role === "user" ? (
            <MicIcon className="size-3.5" />
          ) : (
            <AudioLinesIcon className="size-3.5" />
          )}
        </span>

        <span className="sr-only">
          {role === "user" ? "You said" : "Assistant said"}
        </span>

        <div className="min-w-0 flex-1 break-words">
          <MessagePrimitive.Parts components={{ Text: SpokenText }} />

          {isSpeaking && (
            <span
              role="status"
              className="ms-1 animate-pulse text-muted-foreground"
              aria-label="Assistant is speaking"
            >
              ●
            </span>
          )}
        </div>

        <SpokenActionBar />
      </div>
    </MessagePrimitive.Root>
  );
};

const SpokenActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="always"
      className="flex shrink-0 gap-1 text-muted-foreground"
    >
      <ActionBarPrimitive.Copy
        render={
          <TooltipIconButton
            tooltip="Copy"
            className="size-7 rounded-md"
          />
        }
      >
        <AuiIf condition={(s) => s.message.isCopied}>
          <CheckIcon className="size-3.5 animate-in zoom-in-50 fade-in duration-200" />
        </AuiIf>

        <AuiIf condition={(s) => !s.message.isCopied}>
          <CopyIcon className="size-3.5" />
        </AuiIf>
      </ActionBarPrimitive.Copy>
    </ActionBarPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom
      render={
        <TooltipIconButton
          tooltip="Scroll to bottom"
          variant="outline"
          className="absolute -top-11 z-10 size-9 self-center rounded-full border-border/80 bg-background/95 p-0 shadow-sm backdrop-blur disabled:invisible"
        />
      }
    >
      <ArrowDownIcon className="size-4" />
    </ThreadPrimitive.ScrollToBottom>
  );
};

/* =========================================================
   WELCOME
   ========================================================= */

const ThreadWelcome: FC = () => {
  return (
    <div className="aui-thread-welcome-root mx-auto flex w-full max-w-3xl flex-col px-1 pb-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 shadow-sm">
          <WrenchIcon className="size-5 text-blue-400" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          What are you building today?
        </h1>

        <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
          Your AI development partner for coding, debugging, architecture,
          code review, and technical problem solving.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <WelcomeCapability
          icon={<FileCode2Icon className="size-4" />}
          title="Write & improve code"
          description="Build components, APIs, functions and complete features."
        />

        <WelcomeCapability
          icon={<WrenchIcon className="size-4" />}
          title="Debug problems"
          description="Find bugs, explain errors and fix broken implementations."
        />

        <WelcomeCapability
          icon={<FolderGit2Icon className="size-4" />}
          title="Design architecture"
          description="Plan scalable frontend, backend and AI application systems."
        />

        <WelcomeCapability
          icon={<LightbulbIcon className="size-4" />}
          title="Learn faster"
          description="Understand concepts with practical developer-focused explanations."
        />
      </div>
    </div>
  );
};

const WelcomeCapability: FC<{
  icon: ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="group rounded-xl border border-border/70 bg-card/30 p-4 transition-colors hover:border-border hover:bg-card/60">
      <div className="mb-3 flex size-8 items-center justify-center rounded-lg border border-border/70 bg-muted/50 text-muted-foreground transition-colors group-hover:border-blue-500/20 group-hover:text-blue-400">
        {icon}
      </div>

      <p className="text-sm font-medium text-foreground">{title}</p>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

/* =========================================================
   SUGGESTIONS
   ========================================================= */

const ThreadSuggestions: FC = () => {
  return (
    <div className="grid w-full gap-2 pb-1 sm:grid-cols-2">
      <ThreadPrimitive.Suggestions>
        {() => <ThreadSuggestionItem />}
      </ThreadPrimitive.Suggestions>
    </div>
  );
};

const ThreadSuggestionItem: FC = () => {
  return (
    <div className="fade-in slide-in-from-bottom-2 animate-in duration-200">
      <SuggestionPrimitive.Trigger
        send
        render={
          <button
            type="button"
            className="group flex min-h-[68px] w-full items-center gap-3 rounded-xl border border-border/70 bg-card/30 px-3.5 py-3 text-left transition-colors hover:border-border hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
          />
        }
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/50 text-muted-foreground transition-colors group-hover:border-blue-500/20 group-hover:text-blue-400">
          <SparklesIcon className="size-3.5" />
        </span>

        <span className="min-w-0 flex-1">
          <SuggestionPrimitive.Title className="block truncate text-sm font-medium text-foreground" />

          <SuggestionPrimitive.Description className="mt-0.5 block truncate text-xs text-muted-foreground empty:hidden" />
        </span>

        <ArrowUpIcon className="size-3.5 shrink-0 text-muted-foreground/50 transition-transform group-hover:-translate-y-0.5 group-hover:text-foreground" />
      </SuggestionPrimitive.Trigger>
    </div>
  );
};

/* =========================================================
   COMPOSER
   ========================================================= */

const Composer: FC<{ autoFocus: boolean }> = ({ autoFocus }) => {
  return (
    <ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col">
      <ComposerPrimitive.AttachmentDropzone
        render={
          <div
            data-slot="aui_composer-shell"
            className="group flex w-full cursor-text flex-col gap-2 rounded-2xl border border-border/70 bg-card/40 p-[var(--composer-padding)] shadow-sm transition-[border-color,background-color,box-shadow] data-[dragging=true]:border-blue-500/50 data-[dragging=true]:border-dashed data-[dragging=true]:bg-blue-500/5"
          />
        }
      >
        <ComposerAttachments />

       <ComposerPrimitive.Input
  placeholder="Ask anything about your code..."
  className="aui-composer-input caret-primary placeholder:text-muted-foreground/50 max-h-48 min-h-11 w-full resize-none border-0 bg-transparent px-2.5 py-1.5 text-[15px] leading-6 text-foreground outline-none ring-0 shadow-none focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none"
  rows={1}
  autoFocus={autoFocus}
  enterKeyHint="send"
  aria-label="Message input"
/>

        <ComposerAction />
      </ComposerPrimitive.AttachmentDropzone>

      <p className="mt-2 hidden text-center text-[10px] text-muted-foreground/50 sm:block">
        Enter to send · Shift + Enter for new line
      </p>
    </ComposerPrimitive.Root>
  );
};
const ComposerAction: FC = () => {
  const isSending = useAuiState(
    (s) =>
      s.composer.submission !== undefined &&
      !(s.thread.isRunning && s.thread.capabilities.cancel),
  );

  return (
    <div className="flex items-center justify-between">
      <ComposerAddAttachment />

      <div className="flex items-center gap-1.5">
        <AuiIf condition={(s) => s.thread.capabilities.dictation}>
          <AuiIf condition={(s) => s.composer.dictation == null}>
            <ComposerPrimitive.Dictate
              render={
                <TooltipIconButton
                  tooltip="Voice input"
                  side="bottom"
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Start voice input"
                />
              }
            >
              <MicIcon className="size-4" />
            </ComposerPrimitive.Dictate>
          </AuiIf>

          <AuiIf condition={(s) => s.composer.dictation != null}>
            <ComposerPrimitive.StopDictation
              render={
                <TooltipIconButton
                  tooltip="Stop dictation"
                  side="bottom"
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full text-red-400 hover:bg-red-500/10"
                  aria-label="Stop voice input"
                />
              }
            >
              <SquareIcon className="size-3.5 animate-pulse fill-current" />
            </ComposerPrimitive.StopDictation>
          </AuiIf>
        </AuiIf>

        <AuiIf
          condition={(s) =>
            !s.composer.canCancel ||
            (s.thread.voice !== undefined &&
              s.composer.submission === undefined)
          }
        >
          <ComposerPrimitive.Send
            render={
              <TooltipIconButton
                tooltip="Send message"
                side="bottom"
                type="button"
                variant="default"
                size="icon"
                className="size-8 rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-500"
                aria-label="Send message"
              />
            }
          >
            <ArrowUpIcon className="size-4" />
          </ComposerPrimitive.Send>
        </AuiIf>

        <AuiIf
          condition={(s) =>
            s.composer.canCancel &&
            (s.thread.voice === undefined ||
              s.composer.submission !== undefined)
          }
        >
          <ComposerPrimitive.Cancel
            render={
              <Button
                type="button"
                variant="default"
                size="icon"
                className="size-8 rounded-full bg-muted-foreground/80 text-background hover:bg-muted-foreground"
                aria-label={
                  isSending ? "Cancel sending" : "Stop generating"
                }
              />
            }
          >
            <SquareIcon className="size-3.5 fill-current" />
          </ComposerPrimitive.Cancel>
        </AuiIf>
      </div>
    </div>
  );
};

/* =========================================================
   ERROR
   ========================================================= */

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-300">
        <ErrorPrimitive.Message className="line-clamp-3" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
};

/* =========================================================
   ASSISTANT MESSAGE
   ========================================================= */

const AssistantMessage: FC = () => {
  const {
    ToolFallback: ToolFallbackComponent = ToolFallback,
    ToolGroup,
    ReasoningGroup,
    TaskGroup: TaskGroupComponent,
  } = useContext(ThreadComponentsContext);

  const groupBy = TaskGroupComponent ? taskAwareGroupBy : messageGroupBy;

  const ACTION_BAR_PT = "pt-1.5";
  const ACTION_BAR_HEIGHT = `min-h-7.5 ${ACTION_BAR_PT}`;

  return (
    <MessagePrimitive.Root
      data-slot="aui_assistant-message-root"
      data-role="assistant"
      className="fade-in slide-in-from-bottom-1 animate-in relative pb-6 duration-150 [contain-intrinsic-size:auto_200px] [content-visibility:auto]"
    >
      <div
        data-slot="aui_assistant-message-content"
        className="text-foreground break-words"
      >
        <div className="mb-3 flex items-center gap-2 px-1">
          <div className="flex size-7 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">
            <SparklesIcon className="size-3.5 text-blue-400" />
          </div>

          <span className="text-xs font-semibold text-foreground/80">
            Dev Assistant
          </span>

          <span className="size-1 rounded-full bg-muted-foreground/30" />

          <span className="text-[10px] text-muted-foreground/60">
            AI
          </span>
        </div>

        <div className="px-1 leading-7">
          <MessagePrimitive.GroupedParts groupBy={groupBy}>
            {({ part, children }) => {
              switch (part.type) {
                case "group-chainOfThought":
                  return (
                    <div data-slot="aui_chain-of-thought">
                      {children}
                    </div>
                  );

                case "group-task":
                  return TaskGroupComponent ? (
                    <TaskGroupComponent group={part} />
                  ) : null;

                case "group-tool":
                  if (ToolGroup) {
                    return (
                      <ToolGroup group={part}>{children}</ToolGroup>
                    );
                  }

                  return (
                    <ToolGroupRoot variant="ghost">
                      <ToolGroupTrigger
                        count={part.indices.length}
                        active={part.status.type === "running"}
                      />
                      <ToolGroupContent>{children}</ToolGroupContent>
                    </ToolGroupRoot>
                  );

                case "group-reasoning": {
                  if (ReasoningGroup) {
                    return (
                      <ReasoningGroup group={part}>
                        {children}
                      </ReasoningGroup>
                    );
                  }

                  const running = part.status.type === "running";

                  return (
                    <ReasoningRoot streaming={running}>
                      <ReasoningTrigger active={running} />
                      <ReasoningContent aria-busy={running}>
                        <ReasoningText>{children}</ReasoningText>
                      </ReasoningContent>
                    </ReasoningRoot>
                  );
                }

                case "text":
                  return <MarkdownText />;

                case "reasoning":
                  return <Reasoning {...part} />;

                case "tool-call":
                  return (
                    part.toolUI ?? <ToolFallbackComponent {...part} />
                  );

                case "data":
                  return part.dataRendererUI;

                case "file":
                  return (
                    <div
                      data-slot="aui_assistant-message-file"
                      className="py-1"
                    >
                      <File {...part} />
                    </div>
                  );

                case "image":
                  return (
                    <div
                      data-slot="aui_assistant-message-image"
                      className="py-1"
                    >
                      <Image {...part} />
                    </div>
                  );

                case "indicator":
                  return (
                    <span
                      data-slot="aui_assistant-message-indicator"
                      className="ml-1 inline-flex animate-pulse text-blue-400"
                      aria-label="Assistant is working"
                    >
                      ●
                    </span>
                  );

                default:
                  return null;
              }
            }}
          </MessagePrimitive.GroupedParts>
        </div>

        <MessageError />
      </div>

      <div
        data-slot="aui_assistant-message-footer"
        className={cn(
          "ms-1 flex items-center",
          ACTION_BAR_HEIGHT,
        )}
      >
        <BranchPicker />
        <AssistantActionBar />
      </div>
    </MessagePrimitive.Root>
  );
};

/* =========================================================
   ASSISTANT ACTIONS
   ========================================================= */

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="flex gap-0.5 text-muted-foreground animate-in fade-in duration-200"
    >
      <ActionBarPrimitive.Copy
        render={
          <TooltipIconButton
            tooltip="Copy"
            className="size-7 rounded-md hover:bg-muted"
          />
        }
      >
        <AuiIf condition={(s) => s.message.isCopied}>
          <CheckIcon className="size-3.5 text-emerald-400" />
        </AuiIf>

        <AuiIf condition={(s) => !s.message.isCopied}>
          <CopyIcon className="size-3.5" />
        </AuiIf>
      </ActionBarPrimitive.Copy>

      <AuiIf condition={(s) => s.thread.capabilities.feedback}>
        <ActionBarPrimitive.FeedbackPositive
          render={
            <TooltipIconButton
              tooltip="Helpful"
              className="size-7 rounded-md hover:bg-muted data-[submitted=true]:bg-accent data-[submitted=true]:text-accent-foreground"
            />
          }
        >
          <ThumbsUpIcon className="size-3.5" />
        </ActionBarPrimitive.FeedbackPositive>

        <ActionBarPrimitive.FeedbackNegative
          render={
            <TooltipIconButton
              tooltip="Not helpful"
              className="size-7 rounded-md hover:bg-muted data-[submitted=true]:bg-accent data-[submitted=true]:text-accent-foreground"
            />
          }
        >
          <ThumbsDownIcon className="size-3.5" />
        </ActionBarPrimitive.FeedbackNegative>
      </AuiIf>

      <ActionBarPrimitive.Reload
        render={
          <TooltipIconButton
            tooltip="Regenerate"
            className="size-7 rounded-md hover:bg-muted"
          />
        }
      >
        <RefreshCwIcon className="size-3.5" />
      </ActionBarPrimitive.Reload>

      <ActionBarMorePrimitive.Root>
        <ActionBarMorePrimitive.Trigger
          render={
            <TooltipIconButton
              tooltip="More"
              className="size-7 rounded-md hover:bg-muted data-[state=open]:bg-accent"
            />
          }
        >
          <MoreHorizontalIcon className="size-3.5" />
        </ActionBarMorePrimitive.Trigger>

        <ActionBarMorePrimitive.Content
          side="bottom"
          align="start"
          sideOffset={6}
          className="z-50 min-w-[10rem] overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl"
        >
          <ActionBarPrimitive.ExportMarkdown
            render={
              <ActionBarMorePrimitive.Item className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors hover:bg-muted focus:bg-muted">
                <DownloadIcon className="size-4 text-muted-foreground" />
                Export as Markdown
              </ActionBarMorePrimitive.Item>
            }
          />
        </ActionBarMorePrimitive.Content>
      </ActionBarMorePrimitive.Root>
    </ActionBarPrimitive.Root>
  );
};

/* =========================================================
   USER MESSAGE
   ========================================================= */

const UserFilePart: FileMessagePartComponent = (part) => (
  <div data-slot="aui_user-message-file" className="py-1">
    <File {...part} />
  </div>
);

const UserImagePart: ImageMessagePartComponent = (part) => (
  <div data-slot="aui_user-message-image" className="py-1">
    <Image {...part} />
  </div>
);

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root
      data-slot="aui_user-message-root"
      className="fade-in slide-in-from-bottom-1 animate-in flex w-full flex-col items-end gap-y-2 px-2 duration-150 [contain-intrinsic-size:auto_200px] [content-visibility:auto]"
      data-role="user"
    >
      <UserMessageAttachments />

      <div className="aui-user-message-content-wrapper relative min-w-0 max-w-[90%] sm:max-w-[82%]">
        <div className="aui-user-message-content peer max-w-full rounded-2xl border border-border/70 bg-muted px-4 py-2.5 text-[15px] leading-6 text-foreground shadow-sm break-words empty:hidden">
          <MessagePrimitive.Parts
            components={{
              File: UserFilePart,
              Image: UserImagePart,
            }}
          />
        </div>

        <div className="aui-user-action-bar-wrapper absolute start-0 top-1/2 -translate-x-full -translate-y-1/2 pe-2 opacity-0 transition-opacity group-hover:opacity-100 peer-empty:hidden rtl:translate-x-full">
          <UserActionBar />
        </div>
      </div>

      <BranchPicker
        data-slot="aui_user-branch-picker"
        className="w-full justify-end"
      />
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit
        render={
          <TooltipIconButton
            tooltip="Edit"
            className="size-7 rounded-md hover:bg-muted"
          />
        }
      >
        <PencilIcon className="size-3.5" />
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

/* =========================================================
   EDIT COMPOSER
   ========================================================= */

const EditComposer: FC = () => {
  return (
    <MessagePrimitive.Root
      data-slot="aui_edit-composer-wrapper"
      className="flex flex-col px-1"
    >
      <ComposerPrimitive.Root className="ms-auto flex w-full max-w-[90%] cursor-text flex-col rounded-2xl border border-border bg-card/70 transition-colors focus-within:border-border focus-within:ring-2 focus-within:ring-ring/10 sm:max-w-[82%]">
        <ComposerPrimitive.Input
          className="min-h-14 w-full resize-none bg-transparent px-4 pt-3 pb-1 text-sm leading-6 text-foreground outline-none"
          autoFocus
        />

        <div className="mx-2.5 mb-2.5 flex items-center gap-1.5 self-end">
          <ComposerPrimitive.Cancel
            render={
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-lg px-3 text-muted-foreground hover:text-foreground"
              />
            }
          >
            Cancel
          </ComposerPrimitive.Cancel>

          <ComposerPrimitive.Send
            render={
              <Button
                size="sm"
                className="h-8 rounded-lg bg-blue-600 px-3 text-white hover:bg-blue-500"
              />
            }
          >
            Update
          </ComposerPrimitive.Send>
        </div>
      </ComposerPrimitive.Root>
    </MessagePrimitive.Root>
  );
};

/* =========================================================
   BRANCH PICKER
   ========================================================= */

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "-ms-1 me-2 inline-flex items-center text-xs text-muted-foreground",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous
        render={
          <TooltipIconButton
            tooltip="Previous"
            className="size-7 rounded-md hover:bg-muted"
          />
        }
      >
        <ChevronLeftIcon className="size-3.5" />
      </BranchPickerPrimitive.Previous>

      <span className="px-1 font-medium">
        <BranchPickerPrimitive.Number /> /{" "}
        <BranchPickerPrimitive.Count />
      </span>

      <BranchPickerPrimitive.Next
        render={
          <TooltipIconButton
            tooltip="Next"
            className="size-7 rounded-md hover:bg-muted"
          />
        }
      >
        <ChevronRightIcon className="size-3.5" />
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};