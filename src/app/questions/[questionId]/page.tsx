"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { JSONContent } from "@tiptap/react";
import { ReadOnlyViewer } from "@/components/editor/ViewOnlyContent";
import { TiptapEditor } from "@/components/editor/RichTextEditor";
import { useQuery } from "@tanstack/react-query";
import {
  Edit,
  Calendar,
  User,
  MessageCircle,
  Loader2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";

// lib/fetchAnswers.ts
export const fetchAnswersByQuestionId = async (questionId: string | number) => {
  const res = await fetch(`/api/questions/${questionId}/answer`);
  if (!res.ok) {
    throw new Error("Failed to fetch answers");
  }
  const data = await res.json();
  return data.answers || [];
};

// lib/fetchComments.ts
export const fetchCommentsByAnswerId = async (
  answerId: string | number,
  questionId: string | number
) => {
  const res = await fetch(
    `/api/questions/${questionId}/answer/comment?answerId=${answerId}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }
  const data = await res.json();
  return data.comments || [];
};

export default function QuestionDetailPage() {
  const { questionId } = useParams();
  const { user } = useAuth();

  const [question, setQuestion] = useState<any>(null);
  const [editorContent, setEditorContent] = useState<JSONContent | undefined>();
  const [loading, setLoading] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Question editing states
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editingQuestionTitle, setEditingQuestionTitle] = useState("");
  const [editingQuestionContent, setEditingQuestionContent] = useState<
    JSONContent | undefined
  >();
  const [questionLoading, setQuestionLoading] = useState(false);

  // Comment states
  const [commentEditorContent, setCommentEditorContent] = useState<
    JSONContent | undefined
  >();
  const [commentLoading, setCommentLoading] = useState(false);
  const [editingComment, setEditingComment] = useState<any>(null);
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [activeCommentAnswerId, setActiveCommentAnswerId] = useState<
    number | null
  >(null);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    fetch(`/api/questions/${questionId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data.question);
      });
  }, [questionId]);

  const {
    data: answers,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["answers", questionId],
    queryFn: () => fetchAnswersByQuestionId(questionId as string),
    enabled: !!questionId,
    staleTime: 0,
  });

  // Comments query - fetch comments for expanded answers
  const { data: allComments, refetch: refetchComments } = useQuery({
    queryKey: ["comments", Array.from(expandedComments)],
    queryFn: async () => {
      const commentPromises = Array.from(expandedComments).map((answerId) =>
        fetchCommentsByAnswerId(answerId, questionId as string).then(
          (comments) => ({ answerId, comments })
        )
      );
      const results = await Promise.all(commentPromises);
      return results.reduce((acc, { answerId, comments }) => {
        acc[answerId] = comments;
        return acc;
      }, {} as Record<number, any[]>);
    },
    enabled: expandedComments.size > 0,
    staleTime: 0,
  });

  const handleAnswerSubmit = async () => {
    if (!editorContent) return;

    setLoading(true);

    try {
      const url = editingAnswer
        ? `/api/questions/${questionId}/answer?answerId=${editingAnswer.id}`
        : `/api/questions/${questionId}/answer`;

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: editorContent }),
      });
      const result = await res.json();

      if (!res.ok) {
        console.error("API error response:", result);
        toast.error(result.message || "Something went wrong");
        return;
      }

      toast.success(
        editingAnswer
          ? "Answer updated successfully"
          : "Answer posted successfully"
      );

      setEditorContent(undefined);
      setEditingAnswer(null);
      setIsEditing(false);
      await refetch();

      try {
        console.log("come in answer not")
        await fetch(`/api/notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: question.userId,
            questionId: question.id,
            description: `${user?.userName || "Someone"} ${
              editingAnswer?.id ? "updated" : "posted"
            } an answer on your question "${question.title}"`,
          }),
        });
      } catch (notifError) {
        console.error("Failed to send notification:", notifError);
      }
    } catch (error) {
      console.error("handleAnswerSubmit error:", error);
      toast.error("Failed to submit your answer");
    } finally {
      setLoading(false);
      setEditorContent(undefined);
      setEditingAnswer(null);
      setIsEditing(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentEditorContent || !activeCommentAnswerId) return;

    setCommentLoading(true);

    try {
      const url = editingComment
        ? `/api/questions/${questionId}/answer/comment?commentId=${editingComment.id}&answerId=${activeCommentAnswerId}`
        : `/api/questions/${questionId}/answer/comment?answerId=${activeCommentAnswerId}`;

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: commentEditorContent }),
      });
      const result = await res.json();

      if (!res.ok) {
        console.error("API error response:", result);
        toast.error(result.message || "Something went wrong");
        return;
      }
      toast.success(
        editingComment
          ? "Comment updated successfully"
          : "Comment posted successfully"
      );

      setCommentEditorContent(undefined);
      setEditingComment(null);
      setIsCommentEditing(false);
      setActiveCommentAnswerId(null);
      await refetchComments();

      try {
        console.log("come in comment not")
        await fetch(`/api/notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: question.userId,
            questionId: question.id,
            description: `${user?.userName || "Someone"} ${
              editingComment?.id ? "updated comment on" : "commented on"
            } an answer to your question "${question.title}"`,
          }),
        });
      } catch (notifError) {
        console.error("Failed to send notification:", notifError);
      }

      // ✅ Collapse comments section after successful post/update
      setExpandedComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(activeCommentAnswerId); // Collapse after action
        return newSet;
      });

    } catch (error) {
      console.error("handleCommentSubmit error:", error);
      toast.error("Failed to submit your comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEditAnswer = (answer: any) => {
    setEditingAnswer(answer);
    setEditorContent(answer.description);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditorContent(undefined);
    setEditingAnswer(null);
    setIsEditing(false);
  };

  // Question editing handlers
  const handleEditQuestion = () => {
    setEditingQuestionTitle(question.title);
    setEditingQuestionContent(question.description);
    setIsEditingQuestion(true);
  };

  const handleQuestionSubmit = async () => {
    if (!editingQuestionTitle.trim() || !editingQuestionContent) return;

    setQuestionLoading(true);

    try {
      const res = await fetch(`/api/questions?questionId=${questionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingQuestionTitle.trim(),
          description: editingQuestionContent,
          tags: question.tag,
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        console.error("API error response:", result);
        toast.error(result.message || "Something went wrong");
        return;
      }

      toast.success("Question updated successfully");

      // Update the question state with the new data
      setQuestion({
        ...question,
        title: editingQuestionTitle.trim(),
        description: editingQuestionContent,
        updatedAt: new Date().toISOString(),
      });

      // Reset editing state
      setIsEditingQuestion(false);
      setEditingQuestionTitle("");
      setEditingQuestionContent(undefined);
    } catch (error) {
      console.error("handleQuestionSubmit error:", error);
      toast.error("Failed to update question");
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleCancelQuestionEdit = () => {
    setEditingQuestionTitle("");
    setEditingQuestionContent(undefined);
    setIsEditingQuestion(false);
  };

  const handleAddComment = (answerId: number) => {
    setActiveCommentAnswerId(answerId);
    setCommentEditorContent(undefined);
    setEditingComment(null);
    setIsCommentEditing(true);
    // Auto-expand comments when adding a comment
    setExpandedComments((prev) => new Set([...Array.from(prev), answerId]));
  };

  const handleEditComment = (comment: any) => {
    setEditingComment(comment);
    setCommentEditorContent(comment.description);
    setIsCommentEditing(true);
    setActiveCommentAnswerId(comment.answerId);
  };

  const handleCancelCommentEdit = () => {
    setCommentEditorContent(undefined);
    setEditingComment(null);
    setIsCommentEditing(false);
    setActiveCommentAnswerId(null);
  };

  const toggleComments = (answerId: number) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(answerId)) {
        newSet.delete(answerId);
      } else {
        newSet.add(answerId);
      }
      return newSet;
    });
    refetchComments();
  };

  const getCommentsForAnswer = (answerId: number) => {
    return allComments?.[answerId] || [];
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2 text-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading question...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        {/* Question Header */}
        <div
          className={`bg-card-dark rounded-lg border p-4 sm:p-6 mb-6 transition-colors ${
            isEditingQuestion
              ? "border-primary/50 bg-primary/5"
              : "border-border"
          }`}
        >
          {isEditingQuestion ? (
            // Edit Question Form
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary">
                  Edit Question
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelQuestionEdit}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Question Title
                </label>
                <Input
                  value={editingQuestionTitle}
                  onChange={(e) => setEditingQuestionTitle(e.target.value)}
                  placeholder="Enter your question title..."
                  className="bg-background border-border text-text-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Question Description
                </label>
                <TiptapEditor
                  key="edit-question"
                  content={editingQuestionContent}
                  onChange={(content) => setEditingQuestionContent(content)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
                  disabled={
                    questionLoading ||
                    !editingQuestionTitle.trim() ||
                    !editingQuestionContent
                  }
                  onClick={handleQuestionSubmit}
                >
                  {questionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Question"
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="border-border hover:bg-border"
                  onClick={handleCancelQuestionEdit}
                >
                  Cancel Edit
                </Button>
              </div>
            </div>
          ) : (
            // Display Question
            <>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary mb-3 break-words">
                {question.title}
              </h1>

              {/* Question Tags */}
              {question.tag && question.tag.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tag.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-text-secondary mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Asked by {question.user?.userName || "Anonymous"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(question.createdAt), "PPP")}</span>
                </div>
                {question.updatedAt &&
                  question.updatedAt !== question.createdAt && (
                    <span className="text-xs text-primary">(edited)</span>
                  )}
              </div>

              <div className="prose dark:prose-invert max-w-none mb-4">
                <ReadOnlyViewer content={question.description} />
              </div>

              {user?.id === question.userId && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-card-dark border-border hover:bg-border"
                  onClick={handleEditQuestion}
                  disabled={isEditingQuestion}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Question
                </Button>
              )}
            </>
          )}
        </div>

        {/* Answers Section */}
        <div className="bg-card-dark rounded-lg border border-border p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
              Answers ({answers?.length || 0})
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : answers?.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No answers yet. Be the first to answer!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {answers?.map((ans: any, idx: number) => (
                <div
                  key={ans.id || idx}
                  className={`bg-background rounded-lg border p-4 sm:p-6 transition-colors ${
                    editingAnswer?.id === ans.id
                      ? "border-primary/50 bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-text-secondary">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{ans.user?.userName || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(ans.createdAt), "PPP")}</span>
                      </div>
                      {ans.updatedAt && ans.updatedAt !== ans.createdAt && (
                        <span className="text-xs text-primary">(edited)</span>
                      )}
                    </div>

                    {user?.id === ans.userId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-border hover:bg-border w-fit"
                        onClick={() => handleEditAnswer(ans)}
                        disabled={isEditing}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {editingAnswer?.id === ans.id ? "Editing..." : "Edit"}
                      </Button>
                    )}
                  </div>

                  <div className="prose dark:prose-invert max-w-none mb-4">
                    <ReadOnlyViewer content={ans.description} />
                  </div>

                  {/* Answer Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 border-t border-border pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-text-secondary hover:text-text-primary hover:bg-border/50 justify-start sm:justify-center"
                      onClick={() => handleAddComment(ans.id)}
                      disabled={isCommentEditing}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Comment
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-text-secondary hover:text-text-primary hover:bg-border/50 justify-start sm:justify-center"
                      onClick={() => toggleComments(ans.id)}
                    >
                      {expandedComments.has(ans.id) ? (
                        <ChevronUp className="w-4 h-4 mr-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 mr-2" />
                      )}
                      {expandedComments.has(ans.id) ? "Hide" : "Show"} Comments
                      {getCommentsForAnswer(ans.id).length > 0 && (
                        <span className="ml-1 text-xs">
                          ({getCommentsForAnswer(ans.id).length})
                        </span>
                      )}
                    </Button>
                  </div>

                  {/* Comments Section */}
                  {expandedComments.has(ans.id) && (
                    <div className="mt-4 border-t border-border pt-4">
                      {commentLoading ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        </div>
                      ) : (
                        <>
                          {getCommentsForAnswer(ans.id).length === 0 ? (
                            <div className="text-sm text-center text-text-secondary py-3">
                              No comments yet. Be the first to comment.
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {getCommentsForAnswer(ans.id).map(
                                (comment: any) => (
                                  <div
                                    key={comment.id}
                                    className={`bg-card-dark rounded-lg border p-3 sm:p-4 transition-colors ${
                                      editingComment?.id === comment.id
                                        ? "border-primary/50 bg-primary/5"
                                        : "border-border/50"
                                    }`}
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-text-secondary">
                                        <div className="flex items-center gap-2">
                                          <User className="w-3 h-3" />
                                          <span>
                                            {comment.user?.userName ||
                                              "Anonymous"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="w-3 h-3" />
                                          <span>
                                            {format(
                                              new Date(comment.createdAt),
                                              "PPP"
                                            )}
                                          </span>
                                        </div>
                                        {comment.updatedAt &&
                                          comment.updatedAt !==
                                            comment.createdAt && (
                                            <span className="text-xs text-primary">
                                              (edited)
                                            </span>
                                          )}
                                      </div>

                                      {user?.id === comment.userId && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-xs h-6 px-2 w-fit"
                                          onClick={() =>
                                            handleEditComment(comment)
                                          }
                                          disabled={isCommentEditing}
                                        >
                                          <Edit className="w-3 h-3 mr-1" />
                                          {editingComment?.id === comment.id
                                            ? "Editing..."
                                            : "Edit"}
                                        </Button>
                                      )}
                                    </div>

                                    <div className="prose dark:prose-invert max-w-none prose-sm">
                                      <ReadOnlyViewer
                                        content={comment.description}
                                      />
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </>
                      )}

                      {/* Comment Editor */}
                      {activeCommentAnswerId === ans.id && (
                        <div className="mt-4 border-t border-border pt-4">
                          <div className="bg-card-dark rounded-lg border border-border p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-base font-medium text-text-primary">
                                {editingComment
                                  ? "Edit Comment"
                                  : "Add Comment"}
                              </h4>
                            </div>

                            <div className="mb-3">
                              <TiptapEditor
                                key={editingComment?.id || `comment-${ans.id}`}
                                content={commentEditorContent}
                                onChange={(content) =>
                                  setCommentEditorContent(content)
                                }
                              />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
                                disabled={
                                  commentLoading || !commentEditorContent
                                }
                                onClick={handleCommentSubmit}
                              >
                                {commentLoading ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    {editingComment
                                      ? "Updating..."
                                      : "Posting..."}
                                  </>
                                ) : editingComment ? (
                                  "Update Comment"
                                ) : (
                                  "Post Comment"
                                )}
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                className="border-border hover:bg-border"
                                onClick={handleCancelCommentEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Answer Editor */}
        {!isEditingQuestion && (
          <div className="bg-card-dark rounded-lg border border-border p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                {editingAnswer ? "Edit Your Answer" : "Your Answer"}
              </h3>
            </div>
            <div className="mb-4">
              <TiptapEditor
                key={editingAnswer?.id || "new-answer"} // Force re-render when switching between edit/new
                content={editorContent}
                onChange={(content) => setEditorContent(content)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
                disabled={loading || !editorContent}
                onClick={handleAnswerSubmit}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editingAnswer ? "Updating..." : "Posting..."}
                  </>
                ) : editingAnswer ? (
                  "Update Answer"
                ) : (
                  "Post Answer"
                )}
              </Button>

              {editingAnswer && (
                <Button
                  variant="outline"
                  className="border-border hover:bg-border"
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
