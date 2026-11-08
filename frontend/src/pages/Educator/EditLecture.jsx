import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

function EditLecture() {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();

  const [lectureTitle, setLectureTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [isPreviewFree, setIsPreviewFree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch lecture details
  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setFetching(true);

        const result = await axios.get(
          `${serverUrl}/api/course/courselecture/${courseId}`,
          { withCredentials: true }
        );

        const lectures = result.data.lectures || [];

        const lecture = lectures.find(
          (item) => item._id === lectureId
        );

        if (!lecture) {
          toast.error("Lecture not found");
          return;
        }

        setLectureTitle(lecture.lectureTitle || "");
        setVideoUrl(lecture.videoUrl || "");
        setIsPreviewFree(Boolean(lecture.isPreviewFree));
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load lecture"
        );
      } finally {
        setFetching(false);
      }
    };

    fetchLecture();
  }, [courseId, lectureId]);

  // Save lecture changes
  const handleSave = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Please enter lecture title");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("lectureTitle", lectureTitle.trim());
      formData.append("isPreviewFree", String(isPreviewFree));

      if (videoFile) {
        formData.append("videoUrl", videoFile);
      }

      const result = await axios.post(
        `${serverUrl}/api/course/editlecture/${lectureId}`,
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success(
        result.data.message || "Lecture updated successfully"
      );

      navigate(`/createlecture/${courseId}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update lecture"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <ClipLoader color="white" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(`/createlecture/${courseId}`)}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-8"
        >
          <FaArrowLeftLong />
          Back to Lectures
        </button>

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-2">
          Edit Lecture
        </h1>

        <p className="text-gray-400 mb-8">
          Update lecture details and video content.
        </p>

        {/* Form */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-6">

          {/* Lecture Title */}
          <div>
            <label className="block mb-2 font-medium">
              Lecture Title
            </label>

            <input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Enter lecture title"
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 outline-none focus:border-blue-500"
            />
          </div>

          {/* Current Video */}
          {videoUrl && (
            <div>
              <label className="block mb-2 font-medium">
                Current Lecture Video
              </label>

              <video
                src={videoUrl}
                controls
                className="w-full rounded-lg max-h-80 bg-black"
              />
            </div>
          )}

          {/* Upload Video */}
          <div>
            <label className="block mb-2 font-medium">
              Upload New Video
            </label>

            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setVideoFile(file || null);
              }}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600"
            />

            {videoFile && (
              <p className="text-sm text-green-400 mt-2">
                Selected: {videoFile.name}
              </p>
            )}

            <p className="text-sm text-gray-400 mt-2">
              Leave empty to keep the existing video.
            </p>
          </div>

          {/* Preview Free */}
          <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
            <div>
              <h3 className="font-medium">
                Free Preview
              </h3>

              <p className="text-sm text-gray-400">
                Allow students to watch this lecture for free.
              </p>
            </div>

            <input
              type="checkbox"
              checked={isPreviewFree}
              onChange={(e) =>
                setIsPreviewFree(e.target.checked)
              }
              className="w-5 h-5 accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <ClipLoader color="white" size={20} />
                Saving...
              </>
            ) : (
              "Save Lecture"
            )}
          </button>

        </div>
      </div>
    </div>
  );
}

export default EditLecture;