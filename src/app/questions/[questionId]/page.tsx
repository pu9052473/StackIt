"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { JSONContent } from "@tiptap/react";
import { ReadOnlyViewer } from "@/components/editor/ViewOnlyContent";
import TiptapEditor from "@/components/editor/RichTextEditor";
import { useQuery } from "@tanstack/react-query";
import { Edit, Calendar, User, MessageCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// lib/fetchAnswers.ts
export const fetchAnswersByQuestionId = async (questionId: string | number) => {
  const res = await fetch(`/api/questions/${questionId}/answer`);
  if (!res.ok) {
    throw new Error("Failed to fetch answers");
  }
  const data = await res.json();
  return data.answers || [];
};

export default function QuestionDetailPage() {
  const { questionId } = useParams();
  const { user } = useAuth();

  const [question, setQuestion] = useState<any>(null);
  const [editorContent, setEditorContent] = useState<JSONContent | undefined>();
  const [loading, setLoading] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<any>(null); // Store the entire answer object
  const [isEditing, setIsEditing] = useState(false);

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

      // Reset state
      setEditorContent(undefined);
      setEditingAnswer(null);
      setIsEditing(false);

      // ✅ Trigger refetch to get updated answers
      await refetch();
    } catch (error) {
      console.error("handleAnswerSubmit error:", error);
      toast.error("Failed to submit your answer");
    } finally {
      setLoading(false);
      refetch();
    }
  };

  const handleEditAnswer = (answer: any) => {
    // Store the answer object in state instead of URL
    setEditingAnswer(answer);
    setEditorContent(answer.description);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditorContent(undefined);
    setEditingAnswer(null);
    setIsEditing(false);
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
      <div className="max-w-4xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        {/* Question Header */}
        <div className="bg-card-dark rounded-lg border border-border p-4 sm:p-6 mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary mb-3 break-words">
            {question.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-text-secondary mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Asked by {question.user?.userName || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(question.createdAt), "PPP")}</span>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-4">
            <ReadOnlyViewer content={question.description} />
          </div>

          {user?.id === question.userId && (
            <Button
              variant="outline"
              size="sm"
              className="bg-card-dark border-border hover:bg-border"
              onClick={() => alert("Edit feature pending")}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Question
            </Button>
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
            <div className="space-y-4">
              {answers?.map((ans: any, idx: number) => (
                <div
                  key={ans.id || idx}
                  className={`bg-background rounded-lg border p-4 transition-colors ${
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

                  <div className="prose dark:prose-invert max-w-none">
                    <ReadOnlyViewer content={ans.description} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Answer Editor */}
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
      </div>
    </div>
  );
}
