// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// type Question = {
//   id: string;
//   title: string;
//   createdAt: string;
//   isAnswered: boolean;
//   user: { name: string };
//   answers: any[];
// };

// export default function QuestionsPage() {
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [page, setPage] = useState(1);
//   const [query, setQuery] = useState("");
//   const [filter, setFilter] = useState("newest");
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const limit = 10;

//   const fetchQuestions = async () => {
//     setLoading(true);
//     const params = new URLSearchParams({
//       page: String(page),
//       limit: String(limit),
//       query,
//       filter,
//     });

//     const res = await fetch(`/api/questions?${params}`);
//     const data = await res.json();
//     setQuestions(data.questions);
//     setTotal(data.total);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, [page, filter]);

//   const totalPages = Math.ceil(total / limit);

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 text-gray-100">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">All Questions</h1>
//         <Link href="/questions/ask">
//           <Button className="bg-blue-600 hover:bg-blue-700">Ask Question</Button>
//         </Link>
//       </div>

//       <div className="flex gap-2 mb-4">
//         <Input
//           placeholder="Search questions..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="w-full bg-gray-800 border-gray-700 text-white"
//         />
//         <Button
//           onClick={() => {
//             setPage(1);
//             fetchQuestions();
//           }}
//         >
//           Search
//         </Button>
//       </div>

//       <div className="flex gap-2 mb-4">
//         {["newest", "answered", "unanswered"].map((f) => (
//           <Button
//             key={f}
//             variant={filter === f ? "default" : "secondary"}
//             className={cn(
//               filter === f ? "bg-blue-600 text-white" : "bg-gray-800",
//               "capitalize"
//             )}
//             onClick={() => {
//               setFilter(f);
//               setPage(1);
//             }}
//           >
//             {f}
//           </Button>
//         ))}
//       </div>

//       <div className="space-y-6">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           questions.map((q) => (
//             <Link
//               key={q.id}
//               href={`/questions/${q.id}`}
//               className="block p-4 rounded bg-gray-800 hover:bg-gray-700 transition"
//             >
//               <div className="flex justify-between items-center">
//                 <h2 className="text-lg font-semibold">{q.title}</h2>
//                 <span
//                   className={cn(
//                     "px-2 py-1 text-xs rounded",
//                     q.isAnswered ? "bg-green-600" : "bg-yellow-600"
//                   )}
//                 >
//                   {q.isAnswered ? "Answered" : "Unanswered"}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-400 mt-1">
//                 Asked by {q.user.name} on {new Date(q.createdAt).toLocaleDateString()}
//               </p>
//               <p className="text-sm mt-1">{q.answers.length} Answers</p>
//             </Link>
//           ))
//         )}
//       </div>

//       {/* Pagination Controls */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-6 gap-2">
//           {Array.from({ length: totalPages }, (_, i) => (
//             <Button
//               key={i}
//               variant={page === i + 1 ? "default" : "secondary"}
//               className={cn(page === i + 1 ? "bg-blue-600" : "bg-gray-800")}
//               onClick={() => setPage(i + 1)}
//             >
//               {i + 1}
//             </Button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, MessageCircle, Calendar, User, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

type Question = {
  id: string;
  title: string;
  createdAt: string;
  isAnswered: boolean;
  user: { userName: string };
  answer: any[];
  tags?: string[];
  votes?: number;
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("newest");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const limit = 10;

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        query,
        filter,
      });

      const res = await fetch(`/api/questions?${params}`);
      if (!res.ok) {
        throw new Error('Failed to fetch questions');
      }
      
      const data = await res.json();
      setQuestions(data.questions);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, filter]);

  // Trigger search when query changes with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query !== "") {
        setPage(1);
        fetchQuestions();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const totalPages = Math.ceil(total / limit);

  const handleSearch = () => {
    setPage(1);
    fetchQuestions();
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value === "") {
      setPage(1);
      fetchQuestions();
    }
  };

  const filterOptions = [
    { value: "newest", label: "Newest", icon: Calendar },
    { value: "answered", label: "Answered", icon: CheckCircle },
    { value: "unanswered", label: "Unanswered", icon: Clock },
    { value: "votes", label: "Most Votes", icon: MessageCircle }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Questions</h1>
            <p className="text-foreground-muted mt-1">{total} questions</p>
          </div>
          <Link href="/questions/ask" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Ask Question
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-card-dark border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Search questions..."
                value={query}
                onChange={handleQueryChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="w-full bg-background border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Search
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilter(option.value);
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === option.value
                      ? "bg-primary text-white"
                      : "bg-zinc-800 text-foreground-muted hover:bg-zinc-700 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="mx-auto h-12 w-12 text-foreground-muted mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No questions found</h3>
              <p className="text-foreground-muted">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            questions.map((question) => (
              <div
                key={question.id}
                className="bg-card-dark border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Stats */}
                  <div className="flex sm:flex-col gap-4 sm:gap-2 text-center sm:min-w-[80px]">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-semibold text-foreground">{question.votes || 0}</span>
                      <span className="text-xs text-foreground-muted">votes</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`text-lg font-semibold ${question.isAnswered ? 'text-green-500' : 'text-foreground-muted'}`}>
                        {question.answer.length}
                      </span>
                      <span className="text-xs text-foreground-muted">answers</span>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h2 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                        {question.title}
                      </h2>
                      {question.isAnswered && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      )}
                    </div>

                    {/* Tags */}
                    {question.tags && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {question.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-foreground-muted">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>asked by</span>
                        <span className="text-primary font-medium">{question.user.userName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(question.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8 gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-zinc-800 text-foreground-muted hover:bg-zinc-700 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 7) {
                  pageNumber = i + 1;
                } else if (page <= 4) {
                  pageNumber = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNumber = totalPages - 6 + i;
                } else {
                  pageNumber = page - 3 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === pageNumber
                        ? "bg-primary text-white"
                        : "bg-zinc-800 text-foreground-muted hover:bg-zinc-700 hover:text-foreground"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-zinc-800 text-foreground-muted hover:bg-zinc-700 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}