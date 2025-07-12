"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { JSONContent } from "@tiptap/react";
import { ReadOnlyViewer } from "@/components/editor/ViewOnlyContent";
import {TiptapEditor} from "@/components/editor/RichTextEditor";

export default function QuestionDetailPage() {
  const { questionId } = useParams();
  const { user } = useAuth();

  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [editorContent, setEditorContent] = useState<JSONContent | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/questions/${questionId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data.question);
        setAnswers(data.question.answer);
      });
  }, [questionId]);
  console.log("question: ", question);
  const handleAnswerSubmit = async () => {
    if (!editorContent) return;
    setLoading(true);
    const res = await fetch(`/api/questions/${questionId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editorContent }),
    });
    const data = await res.json();
    setAnswers((prev) => [...prev, data.answer]);
    setEditorContent(undefined);
    setLoading(false);
  };

  if (!question) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 text-gray-100">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
        <div className="text-sm text-gray-400">
          Asked by {question.user?.userName} on{" "}
          {format(new Date(question.createdAt), "PPP")}
        </div>
        <div className="mt-4 prose dark:prose-invert">
          <ReadOnlyViewer content={question.description} />
        </div>

        {user?.id === question.userId && (
          <div className="mt-4">
            <Button
              variant="outline"
              className="bg-gray-800"
              onClick={() => alert("Edit feature pending")}
            >
              Edit Question
            </Button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Answers ({answers.length})
        </h2>
        <div className="space-y-4">
          {answers.map((ans, idx) => (
            <div key={idx} className="p-4 border rounded-lg bg-gray-800">
              <div className="text-sm text-gray-300 mb-1">
                {ans.user?.userName} answered on{" "}
                {format(new Date(ans.createdAt), "PPP")}
              </div>
              <div className="prose dark:prose-invert">
                <ReadOnlyViewer content={ans.description} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Your Answer</h3>
        <TiptapEditor
          content={editorContent}
          onChange={(content) => setEditorContent(content)}
        />
        <Button
          className="mt-4 bg-blue-600"
          disabled={loading}
          onClick={handleAnswerSubmit}
        >
          {loading ? "Posting..." : "Post Answer"}
        </Button>
      </div>
    </div>
  );
}
