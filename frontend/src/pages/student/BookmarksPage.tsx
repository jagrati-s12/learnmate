import React, { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { practiceAPI, Bookmark } from '../../api/practice';

export const BookmarksPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setLoading(true);
        const data = await practiceAPI.getBookmarks();
        setBookmarks(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load bookmarks');
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  const handleRemoveBookmark = async (questionId: number) => {
    try {
      await practiceAPI.removeBookmark(questionId);
      // Refresh the list
      setBookmarks((prev) => prev.filter((b) => b.question_id !== questionId));
    } catch (err: any) {
      alert('Failed to remove bookmark: ' + (err.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <>
        <Topbar title="Bookmarks" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full border-4 border-t-blue-600 h-16 w-16 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bookmarks...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Topbar title="Bookmarks" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Bookmarks" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Bookmarked Questions</h2>
              {bookmarks.length > 0 && (
                <Button variant="primary" size="sm">
                  Practice All ({bookmarks.length})
                </Button>
              )}
            </CardHeader>
            <CardBody>
              {bookmarks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-2">No bookmarks yet.</p>
                  <p className="text-sm text-gray-500">
                    Bookmark questions during practice to save them here for later review.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookmarks.map((bookmark) => (
                    <div
                      key={bookmark.bookmark_id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0 bg-blue-100 text-blue-600">
                        🔖
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {bookmark.subject_name} • {bookmark.topic_name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {bookmark.question_text}
                        </div>
                        {bookmark.bookmarked_at && (
                          <div className="text-xs text-gray-400 mt-1">
                            Bookmarked on {new Date(bookmark.bookmarked_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRemoveBookmark(bookmark.question_id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};