"use client";
import TiptapEditor from "@/components/editor/RichTextEditor";
import { JSONContent } from "@tiptap/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FormData {
  title: string;
  description: JSONContent;
  tags: string[];
}

interface FormErrors {
  title?: string;
  description?: string;
  tags?: string;
}

export default function AskQuestionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: {},
    tags: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    } else if (formData.title.trim().length > 150) {
      newErrors.title = "Title must be less than 150 characters";
    }

    // Description validation
    if (
      !formData.description.content ||
      formData.description.content.length === 0
    ) {
      newErrors.description = "Description is required";
    }

    // Tags validation
    if (formData.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    } else if (formData.tags.length > 5) {
      newErrors.tags = "Maximum 5 tags allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, title: value }));

    // Clear title error when user starts typing
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleDescriptionChange = (content: JSONContent) => {
    setFormData((prev) => ({ ...prev, description: content }));

    // Clear description error when user starts typing
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: undefined }));
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");

      // Clear tags error when user adds a tag
      if (errors.tags) {
        setErrors((prev) => ({ ...prev, tags: undefined }));
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    console.log("formData: ", formData);
    try {
      const response = await fetch("/api/questions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description,
          tags: formData.tags,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post question");
      }

      const data = await response.json();

      toast.success("Question posted successfully!");
      router.push(`/questions/${data.questionId}`);
    } catch (error) {
      console.error("Error posting question:", error);
      toast.error("Failed to post question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  //   console.log("formData.description: ", formData.description);
  const isTitleValid = formData.title.trim().length >= 10;
  const isDescriptionValid =
    formData.description.content && formData.description.content.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Ask a public question
          </h1>
          <p className="text-text-secondary">
            Get help from millions of developers. Be specific and clear with
            your question.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Section */}
          <div className="bg-card-dark border border-zinc-800 rounded-lg p-6">
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-text-primary mb-2"
              >
                Title
              </label>
              <p className="text-sm text-text-secondary mb-3">
                Be specific and imagine you're asking a question to another
                person.
              </p>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                className={`w-full px-3 py-2 bg-zinc-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder-text-secondary ${
                  errors.title ? "border-red-500" : "border-zinc-700"
                }`}
                placeholder="e.g. How to center a div in CSS?"
                maxLength={150}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
              <p className="text-sm text-text-secondary mt-1">
                {formData.title.length}/150 characters
              </p>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-card-dark border border-zinc-800 rounded-lg p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-text-primary mb-2">
                What are the details of your problem?
              </label>
              <p className="text-sm text-text-secondary mb-3">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </p>
              <div
                className={`${
                  !(formData.title.length >= 10)
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                <TiptapEditor
                  content={formData.description}
                  onChange={handleDescriptionChange}
                />
              </div>
              {!(formData.title.length >= 10) && (
                <p className="text-yellow-500 text-sm mt-2">
                  Please enter a valid title before writing your description.
                </p>
              )}
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div className="bg-card-dark border border-zinc-800 rounded-lg p-6">
            <div className="mb-4">
              <label
                htmlFor="tags"
                className="block text-sm font-semibold text-text-primary mb-2"
              >
                Tags
              </label>
              <p className="text-sm text-text-secondary mb-3">
                Add up to 5 tags to describe what your question is about. Start
                typing to see suggestions.
              </p>
              <div
                className={`${
                  !isDescriptionValid ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-900 text-primary-100 border border-primary-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary-300 hover:text-primary-100 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  id="tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  onBlur={addTag}
                  className={`w-full px-3 py-2 bg-zinc-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder-text-secondary ${
                    errors.tags ? "border-red-500" : "border-zinc-700"
                  }`}
                  placeholder="e.g. javascript, react, css (press Enter or Space to add)"
                  disabled={formData.tags.length >= 5}
                />
              </div>
              {!isDescriptionValid && (
                <p className="text-text-secondary text-sm mt-2">
                  Please enter a title and description before adding tags.
                </p>
              )}
              {errors.tags && (
                <p className="text-red-400 text-sm mt-1">{errors.tags}</p>
              )}
              <p className="text-sm text-text-secondary mt-1">
                {formData.tags.length}/5 tags
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !isTitleValid || !isDescriptionValid}
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {isSubmitting ? "Posting..." : "Post your question"}
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 bg-primary-950 border border-primary-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-primary-100 mb-2">
            Tips for getting good answers quickly
          </h3>
          <ul className="text-sm text-primary-200 space-y-1">
            <li>• Make your title question specific and clear</li>
            <li>• Include relevant tags to help others find your question</li>
            <li>• Show what you've tried and what didn't work</li>
            <li>• Provide a minimal reproducible example when possible</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
