"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
import type {
  LeadershipMember,
  LeadershipCategory,
  ChorusAffiliation,
  PageContent,
} from "@/types/admin";
import { PAGE_CONTENT_SCHEMA } from "@/types/admin";
import ImagePickerModal from "@/components/admin/ImagePickerModal";

const categoryInfo: Record<
  LeadershipCategory,
  { name: string; description: string }
> = {
  musicLeadership: {
    name: "Music Leadership",
    description: "Directors and artistic leaders",
  },
  boardMember: {
    name: "Board Members",
    description: "Executive board positions",
  },
  boardAtLarge: {
    name: "Board Members at Large",
    description: "At-large board positions",
  },
};

const chorusAffiliationOptions: { value: ChorusAffiliation | ""; label: string }[] = [
  { value: "", label: "No specific affiliation" },
  { value: "harmony", label: "Parkside Harmony" },
  { value: "melody", label: "Parkside Melody" },
  { value: "both", label: "Both Choruses" },
];

interface LeadershipTabProps {
  pageContent: PageContent;
  onContentSave: (pageKey: "leadership", content: PageContent) => Promise<void>;
  saving: boolean;
}

interface MemberFormData {
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  category: LeadershipCategory;
  chorusAffiliation?: ChorusAffiliation;
}

const defaultFormData: MemberFormData = {
  name: "",
  title: "",
  bio: "",
  photoUrl: "",
  category: "musicLeadership",
  chorusAffiliation: undefined,
};

export default function LeadershipTab({
  pageContent,
  onContentSave,
  saving,
}: LeadershipTabProps) {
  const [members, setMembers] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<LeadershipCategory, boolean>>({
    musicLeadership: true,
    boardMember: true,
    boardAtLarge: true,
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<LeadershipMember | null>(null);
  const [formData, setFormData] = useState<MemberFormData>(defaultFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);

  // Image picker state
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  // Page content editing
  const [localContent, setLocalContent] = useState<PageContent>(pageContent);
  const [hasContentChanges, setHasContentChanges] = useState(false);
  const schema = PAGE_CONTENT_SCHEMA.leadership;

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    setLocalContent(pageContent);
    setHasContentChanges(false);
  }, [pageContent]);

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/admin/leadership");
      const data = await response.json();
      if (data.success) {
        setMembers(data.data);
      }
    } catch (error) {
      console.error("Error fetching leadership:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: LeadershipCategory) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const openAddModal = (category: LeadershipCategory) => {
    setEditingMember(null);
    setFormData({ ...defaultFormData, category });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member: LeadershipMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      title: member.title,
      bio: member.bio,
      photoUrl: member.photoUrl,
      category: member.category,
      chorusAffiliation: member.chorusAffiliation,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setFormData(defaultFormData);
    setFormError(null);
  };

  const handleFormSubmit = async () => {
    if (!formData.name.trim() || !formData.title.trim()) {
      setFormError("Name and title are required");
      return;
    }

    setFormSaving(true);
    setFormError(null);

    try {
      if (editingMember) {
        // Update existing member
        const response = await fetch(`/api/admin/leadership/${editingMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
      } else {
        // Create new member
        const response = await fetch("/api/admin/leadership", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
      }

      await fetchMembers();
      closeModal();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (member: LeadershipMember) => {
    if (!confirm(`Are you sure you want to remove ${member.name}?`)) return;

    try {
      const response = await fetch(`/api/admin/leadership/${member.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        await fetchMembers();
      }
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const handleContentFieldChange = (key: string, value: string) => {
    setLocalContent((prev) => ({ ...prev, [key]: value }));
    setHasContentChanges(true);
  };

  const handleContentSave = async () => {
    await onContentSave("leadership", localContent);
    setHasContentChanges(false);
  };

  const getMembersByCategory = (category: LeadershipCategory) =>
    members.filter((m) => m.category === category).sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header with Content Save */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Leadership Page</h2>
          <p className="text-sm text-gray-500">
            Manage leadership members and page content
          </p>
        </div>
        {hasContentChanges && (
          <button
            onClick={handleContentSave}
            className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Content Changes"}
          </button>
        )}
      </div>

      {/* Page Content Fields */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Page Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schema.fields.map((field) => (
            <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={localContent[field.key] || ""}
                  onChange={(e) => handleContentFieldChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  rows={2}
                />
              ) : (
                <input
                  type="text"
                  value={localContent[field.key] || ""}
                  onChange={(e) => handleContentFieldChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Leadership Members by Category */}
      {(["musicLeadership", "boardMember", "boardAtLarge"] as LeadershipCategory[]).map(
        (category) => (
          <div
            key={category}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => toggleCategory(category)}
              className="w-full px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <div className="text-left">
                <h3 className="font-medium text-gray-900">
                  {categoryInfo[category].name}
                </h3>
                <p className="text-xs text-gray-500">
                  {categoryInfo[category].description} ({getMembersByCategory(category).length} members)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openAddModal(category);
                  }}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                  title="Add member"
                >
                  <Plus className="w-4 h-4" />
                </button>
                {expandedCategories[category] ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {expandedCategories[category] && (
              <div className="p-4">
                {getMembersByCategory(category).length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No members in this category.{" "}
                    <button
                      onClick={() => openAddModal(category)}
                      className="text-indigo-600 hover:underline"
                    >
                      Add one
                    </button>
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {getMembersByCategory(category).map((member) => (
                      <div
                        key={member.id}
                        className="bg-gray-50 rounded-lg p-3 flex flex-col items-center text-center group"
                      >
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-2">
                          {member.photoUrl ? (
                            <Image
                              src={member.photoUrl}
                              alt={member.name}
                              fill
                              className="object-cover object-top"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <h4 className="font-medium text-sm text-gray-900">
                          {member.name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2">{member.title}</p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(member)}
                            className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-white rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(member)}
                            className="p-1 text-gray-500 hover:text-red-600 hover:bg-white rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingMember ? "Edit Member" : "Add New Member"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              {/* Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {formData.photoUrl ? (
                      <Image
                        src={formData.photoUrl}
                        alt="Preview"
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setImagePickerOpen(true)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    {formData.photoUrl ? "Change Photo" : "Select Photo"}
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Full name"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., President, Music Director"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value as LeadershipCategory,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="musicLeadership">Music Leadership</option>
                  <option value="boardMember">Board Member</option>
                  <option value="boardAtLarge">Board Member at Large</option>
                </select>
              </div>

              {/* Chorus Affiliation (only for music leadership) */}
              {formData.category === "musicLeadership" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chorus Affiliation
                  </label>
                  <select
                    value={formData.chorusAffiliation || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        chorusAffiliation: e.target.value as ChorusAffiliation | undefined || undefined,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {chorusAffiliationOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={6}
                  placeholder="Biography... (use blank lines for paragraphs)"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                disabled={formSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
                disabled={formSaving}
              >
                {formSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingMember ? "Update" : "Add"} Member
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onSelect={(url) => {
          setFormData((prev) => ({ ...prev, photoUrl: url }));
          setImagePickerOpen(false);
        }}
        title="Select Member Photo"
        currentImage={formData.photoUrl}
      />
    </div>
  );
}
