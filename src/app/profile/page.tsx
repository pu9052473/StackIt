"use client";

import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle,
  Check,
  RefreshCw,
  Crown,
  Package,
  Shield,
  Star,
  Link,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ProfileSkeleton } from "@/components/(common)/skeleton";

interface SocialLink {
  title: string;
  link: string;
}

const fetchUserData = async (userId: string) => {
  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const data = await response.json();
  return data.user || [];
};

const ProfilePage = () => {
  const { user: authUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    location: "",
    profession: "",
    age: "",
    about: "",
    socialLinks: [] as SocialLink[],
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user", authUser?.id],
    queryFn: () => fetchUserData(authUser?.id as string),
    enabled: !!authUser?.id,
  });

  console.log(userData);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!editForm.name.trim()) errors.name = "Name is required";

    const age = parseInt(editForm.age);
    if (editForm.age && (age < 1 || age > 150))
      errors.age = "Age must be between 1 and 150";

    editForm.socialLinks.forEach((link, index) => {
      const key = `socialLink${index}`;
      if ((link.title && !link.link) || (!link.title && link.link)) {
        errors[key] = "Both title and URL are required";
      } else if (link.link && !/^https?:\/\//i.test(link.link)) {
        errors[key] = "Invalid URL";
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateUserData = async () => {
    if (!validateForm() || !authUser?.id) return;

    setIsUpdating(true);

    try {
      const payload = {
        name: editForm.name || "",
        location: editForm.location || "",
        profession: editForm.profession || "",
        age: editForm.age ? parseInt(editForm.age) : null,
        about: editForm.about || "",
        socialLinks: editForm.socialLinks.filter((l) => l.title && l.link),
      };

      const res = await fetch(`/api/users/${authUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        return toast.error(errData.message || "Failed to update");
      }

      toast.success("Profile updated successFully!");

      await refetch();
      setValidationErrors({});
    } catch (err: any) {
      setIsUpdating(false);
      setIsEditing(false);
      toast.error(err || "Somethig nwent wrong");
    }
  };

  const handleEditProfile = () => {
    if (!userData) return;
    setIsEditing(true);
    setEditForm({
      name: userData.name || "",
      email: userData.email || "",
      location: userData.location || "",
      profession: userData.profession || "",
      age: userData.age?.toString() || "",
      about: userData.about || "",
      socialLinks:
        userData.socialLinks?.length > 0
          ? userData.socialLinks
          : [{ title: "", link: "" }],
    });
  };

  const handleInputChange = (key: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleSocialLinkChange = (
    index: number,
    field: "title" | "link",
    value: string
  ) => {
    setEditForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));

    const key = `socialLink${index}`;
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const addSocialLink = () =>
    setEditForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { title: "", link: "" }],
    }));

  const removeSocialLink = (index: number) =>
    setEditForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));

  const handleCancelEdit = () => {
    setIsEditing(false);
    setValidationErrors({});
    setIsUpdating(false);
  };

  const handleSaveProfile = async () => await updateUserData();

  const handleSignOut = () => {
    // Handle sign out logic
    console.log("Sign out");
  };

  const formatMemberSince = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPackageIcon = (type: any) => {
    switch (type) {
      case "premium":
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case "pro":
        return <Star className="w-5 h-5 text-purple-500" />;
      case "enterprise":
        return <Shield className="w-5 h-5 text-blue-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  if (isLoading) return <ProfileSkeleton />

  if (!userData) {
    return (
      <div className="min-h-screen bg-background-DEFAULT flex items-center justify-center p-4">
        <div className="dark:bg-card-dark bg-card border border-border-DEFAULT rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-foreground-DEFAULT mb-2">
            No User Data Found
          </h3>
          <p className="text-foreground-muted mb-6">
            We couldn't load your profile information.
          </p>
          <button
            onClick={() => refetch}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium mx-auto hover:shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-DEFAULT transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 ">
        {/* Header */}
        <div className="mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground-DEFAULT animate-fade-in">
                Profile
              </h1>
              <p className="text-foreground-muted mt-2">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Profile Card */}
          <div className="xl:col-span-3">
            <div className="dark:bg-card-dark bg-card border border-border-DEFAULT rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up">
              {/* Profile Header */}
              <div className="p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
                      {userData.name
                        ? userData.name.charAt(0).toUpperCase()
                        : userData.email.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div>
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) =>
                                  handleInputChange("name", e.target.value)
                                }
                                className={`text-xl sm:text-2xl font-bold dark:bg-input-dark bg-input border border-border-DEFAULT text-foreground-DEFAULT rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full transition-all ${
                                  validationErrors.name
                                    ? "border-red-300 focus:ring-red-500"
                                    : ""
                                }`}
                                placeholder="Full Name"
                              />
                              {validationErrors.name && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                                  {validationErrors.name}
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                              <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-muted-DEFAULT flex-shrink-0" />
                                <input
                                  type="email"
                                  value={editForm.email}
                                  className="flex-1 dark:bg-input-dark bg-input border border-border-DEFAULT rounded-xl px-3 py-2 text-muted-DEFAULT cursor-not-allowed"
                                  disabled
                                />
                              </div>

                              <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-muted-DEFAULT flex-shrink-0" />
                                <input
                                  type="text"
                                  value={editForm.location}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "location",
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 dark:bg-input-dark bg-input border border-border-DEFAULT text-foreground-DEFAULT rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  placeholder="Location"
                                />
                              </div>

                              <div className="flex items-center gap-3">
                                <Briefcase className="w-5 h-5 text-muted-DEFAULT flex-shrink-0" />
                                <input
                                  type="text"
                                  value={editForm.profession}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "profession",
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 dark:bg-input-dark bg-input border border-border-DEFAULT text-foreground-DEFAULT rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  placeholder="Profession"
                                />
                              </div>

                              <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-muted-DEFAULT flex-shrink-0" />
                                <input
                                  type="number"
                                  value={editForm.age}
                                  onChange={(e) =>
                                    handleInputChange("age", e.target.value)
                                  }
                                  className={`flex-1 dark:bg-input-dark bg-input border border-border-DEFAULT text-foreground-DEFAULT rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                    validationErrors.age
                                      ? "border-red-300 focus:ring-red-500"
                                      : ""
                                  }`}
                                  placeholder="Age"
                                  min="1"
                                  max="150"
                                />
                              </div>
                            </div>

                            {validationErrors.age && (
                              <p className="text-red-600 dark:text-red-400 text-sm">
                                {validationErrors.age}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-foreground-DEFAULT truncate">
                              {userData.name || "No name set"}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-DEFAULT flex-shrink-0" />
                                <span className="text-foreground-muted truncate">
                                  {userData.email}
                                </span>
                              </div>

                              {userData.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-muted-DEFAULT flex-shrink-0" />
                                  <span className="text-foreground-muted truncate">
                                    {userData.location}
                                  </span>
                                </div>
                              )}

                              {userData.profession && (
                                <div className="flex items-center gap-2">
                                  <Briefcase className="w-4 h-4 text-muted-DEFAULT flex-shrink-0" />
                                  <span className="text-foreground-muted truncate">
                                    {userData.profession}
                                  </span>
                                </div>
                              )}

                              {userData.age && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-muted-DEFAULT flex-shrink-0" />
                                  <span className="text-foreground-muted">
                                    {userData.age} years old
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:ml-4 flex-shrink-0">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSaveProfile}
                              disabled={isUpdating}
                              className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] hover:shadow-lg"
                            >
                              {isUpdating ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                              {isUpdating ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={isUpdating}
                              className="flex items-center justify-center gap-2 dark:bg-input-dark bg-input hover:bg-border-DEFAULT text-foreground-muted font-medium px-4 py-2 rounded-xl transition-all duration-200 disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={handleEditProfile}
                            className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-lg"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit Profile
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="border-t border-border-DEFAULT p-5">
                <h3 className="text-lg font-semibold text-foreground-DEFAULT mb-4">
                  About
                </h3>
                {isEditing ? (
                  <textarea
                    value={editForm.about}
                    onChange={(e) => handleInputChange("about", e.target.value)}
                    className="w-full text-foreground-DEFAULT leading-relaxed dark:bg-input-dark bg-input border border-border-DEFAULT rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[50px]"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-foreground-muted leading-relaxed">
                    {userData.about || "No bio added yet."}
                  </p>
                )}
              </div>

              {/* Social Links Section */}
              <div className="border-t border-border-DEFAULT p-5">
                <h3 className="text-lg font-semibold text-foreground-DEFAULT mb-4">
                  Social Links
                </h3>
                {isEditing ? (
                  <div className="space-y-3">
                    {editForm.socialLinks.map((link, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) =>
                              handleSocialLinkChange(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            className="flex-1 dark:bg-input-dark bg-input border border-border-DEFAULT text-foreground-DEFAULT rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Platform name (e.g., LinkedIn)"
                          />
                          <input
                            type="url"
                            value={link.link}
                            onChange={(e) =>
                              handleSocialLinkChange(
                                index,
                                "link",
                                e.target.value
                              )
                            }
                            className="flex-1 dark:bg-input-dark bg-input border border-border-DEFAULT text-foreground-DEFAULT rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="https://..."
                          />
                          <button
                            onClick={() => removeSocialLink(index)}
                            className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-xl transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {validationErrors[`socialLink${index}`] && (
                          <p className="text-red-600 dark:text-red-400 text-sm">
                            {validationErrors[`socialLink${index}`]}
                          </p>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addSocialLink}
                      className="flex items-center gap-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900 px-4 py-3 rounded-xl transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Social Link
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userData.socialLinks && userData.socialLinks.length > 0 ? (
                      userData.socialLinks.map((link: any, index: number) => (
                        <a
                          key={index}
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 dark:bg-input-dark bg-input hover:bg-border-DEFAULT rounded-xl transition-all duration-200 hover:shadow-lg group"
                        >
                          <Link className="w-5 h-5 text-muted-DEFAULT group-hover:text-primary-500 transition-colors" />
                          <div className="flex-1 min-w-0">
                            <span className="text-foreground-DEFAULT font-medium block truncate">
                              {link.title}
                            </span>
                            <span className="text-foreground-muted text-sm block truncate">
                              {link.link}
                            </span>
                          </div>
                        </a>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Link className="w-12 h-12 text-muted-DEFAULT mx-auto mb-3" />
                        <p className="text-foreground-muted">
                          No social links added yet.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Account Info */}
            <div className="dark:bg-card-dark bg-card border border-border-DEFAULT rounded-3xl p-6 shadow-lg animate-slide-up">
              <h3 className="text-lg font-semibold text-foreground-DEFAULT mb-4">
                Account Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-DEFAULT uppercase tracking-wide">
                      Member since
                    </div>
                    <div className="text-foreground-DEFAULT font-medium truncate">
                      {formatMemberSince(userData.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Details */}
            {userData.package && (
              <div className="dark:bg-card-dark bg-card border border-border-DEFAULT rounded-3xl p-6 shadow-lg animate-slide-up">
                <div className="flex items-center gap-2 mb-4">
                  {getPackageIcon(userData.package.type)}
                  <h3 className="text-lg font-semibold text-foreground-DEFAULT">
                    Current Plan
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground-DEFAULT">
                      {userData.package.name}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        userData.package.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {userData.package.status}
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-foreground-DEFAULT">
                    {userData.package.price}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-foreground-muted font-medium">
                      Features included:
                    </div>
                    <ul className="space-y-1">
                      {userData.package.features.map(
                        (feature: any, index: number) => (
                          <li
                            key={index}
                            className="text-sm text-foreground-muted flex items-center gap-2"
                          >
                            <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
