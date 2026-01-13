// import ApiErrorPage from "@/components/api-error/api-error";
// import LoadingBar from "@/components/loader/loading-bar";
// import { Checkbox } from "@/components/ui/checkbox";
// import { TEAM_API, USERMANAGEMENT } from "@/constants/apiConstants";
// import { useApiMutation } from "@/hooks/useApiMutation";
// import { useGetApiMutation } from "@/hooks/useGetApiMutation";
// import { ContextPanel } from "@/lib/context-panel";
// import { CheckSquare, Link, Shield, User } from "lucide-react";
// import { useContext, useEffect, useMemo, useState } from "react";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";

// const ManagementDashboard = () => {
//   const { id } = useParams();
//   const userId = String(id);
//   const { fetchPermissions, fetchPagePermission } = useContext(ContextPanel);
//   const staticUsers = useSelector((state) => state.users?.users);
//   const user = staticUsers.find((u) => String(u.id) === userId);
//   const [buttonPermissions, setButtonPermissions] = useState([]);
//   const [pagePermissions, setPagePermissions] = useState([]);
//   const [updateError, setUpdateError] = useState(null);
//   const { trigger, loading: updating } = useApiMutation();

//   const {
//     data: buttonRes,
//     loading: loadingButtons,
//     error: errorButtons,
//     refetch: refetchButtons,
//   } = useGetApiMutation({
//     url: USERMANAGEMENT.buttonControl,
//     queryKey: ["button-permissions"],
//   });

//   const {
//     data: pageRes,
//     loading: loadingPages,
//     error: errorPages,
//     refetch: refetchPages,
//   } = useGetApiMutation({
//     url: USERMANAGEMENT.pageControl,
//     queryKey: ["page-permissions"],
//   });

//   useEffect(() => {
//     try {
//       if (buttonRes?.buttonPermissions) {
//         setButtonPermissions(buttonRes.buttonPermissions);
//       }
//     } catch (error) {
//       console.error("Error setting button permissions:", error);
//       setUpdateError("Failed to load button permissions");
//     }
//   }, [buttonRes]);

//   useEffect(() => {
//     try {
//       if (pageRes?.pagePermissions) {
//         setPagePermissions(pageRes.pagePermissions);
//       }
//     } catch (error) {
//       console.error("Error setting page permissions:", error);
//       setUpdateError("Failed to load page permissions");
//     }
//   }, [pageRes]);

//   const pages = useMemo(
//     () => [...new Set(pagePermissions.map((p) => p.page))],
//     [pagePermissions]
//   );

//   const toggleUserId = (list, checked) => {
//     try {
//       return checked ? [...list, userId] : list.filter((id) => id !== userId);
//     } catch (error) {
//       console.error("Error toggling user ID:", error);
//       return list;
//     }
//   };

//   const handleButtonToggle = async (permission, checked) => {
//     try {
//       setUpdateError(null);
//       const updatedUserIds = toggleUserId(permission.userIds, checked);

//       setButtonPermissions((prev) =>
//         prev.map((p) =>
//           p.id === permission.id ? { ...p, userIds: updatedUserIds } : p
//         )
//       );

//       await trigger({
//         url: TEAM_API.updateButtonById(permission.id),
//         method: "put",
//         data: {
//           pages: permission.pages,
//           button: permission.button,
//           status: "Active",
//           userIds: updatedUserIds.join(","),
//         },
//       });

//       await refetchButtons();
//       await fetchPermissions();
//     } catch (error) {
//       console.error("Error updating button permission:", error);
//       setUpdateError("Failed to update button permission. Please try again.");
//       // Revert the optimistic update
//       setButtonPermissions((prev) =>
//         prev.map((p) =>
//           p.id === permission.id ? { ...p, userIds: permission.userIds } : p
//         )
//       );
//     }
//   };

//   const handlePageToggle = async (permission, checked) => {
//     try {
//       setUpdateError(null);
//       const updatedUserIds = toggleUserId(permission.userIds, checked);

//       setPagePermissions((prev) =>
//         prev.map((p) =>
//           p.id === permission.id ? { ...p, userIds: updatedUserIds } : p
//         )
//       );

//       await trigger({
//         url: TEAM_API.updatePageById(permission.id),
//         method: "put",
//         data: {
//           page: permission.page,
//           url: permission.url,
//           status: "Active",
//           userIds: updatedUserIds.join(","),
//         },
//       });

//       await refetchPages();
//       await fetchPagePermission();
//     } catch (error) {
//       console.error("Error updating page permission:", error);
//       setUpdateError("Failed to update page permission. Please try again.");
//       // Revert the optimistic update
//       setPagePermissions((prev) =>
//         prev.map((p) =>
//           p.id === permission.id ? { ...p, userIds: permission.userIds } : p
//         )
//       );
//     }
//   };

//   const handleRetry = () => {
//     try {
//       refetchButtons();
//       refetchPages();
//     } catch (error) {
//       console.error("Error retrying fetch:", error);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-96  flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <User className="w-8 h-8 text-red-600" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             User Not Found
//           </h2>
//           <p className="text-gray-600">
//             The requested user could not be found in the system.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (loadingButtons || loadingPages) return <LoadingBar />;
//   if (errorButtons || errorPages) return <ApiErrorPage onRetry={handleRetry} />;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6 rounded-2xl border border-access/40 bg-white/60 backdrop-blur-md   shadow-sm">
//           <div className="p-6">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
//                 <Shield className="h-5 w-5 text-blue-600" />
//               </div>

//               <div>
//                 <h1 className="text-2xl font-semibold text-gray-900">
//                   Permission Management
//                 </h1>
//                 <p className="text-sm text-gray-500">
//                   Managing access for{" "}
//                   <span className="font-medium">{user.name}</span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Error Alert */}
//         {updateError && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
//             <div className="flex items-start gap-3">
//               <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                 <span className="text-red-600 text-xs font-bold">!</span>
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-sm font-semibold text-red-900">Error</h3>
//                 <p className="text-sm text-red-700 mt-1">{updateError}</p>
//               </div>
//               <button
//                 onClick={() => setUpdateError(null)}
//                 className="text-red-400 hover:text-red-600 transition-colors"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Permissions List */}
//         <div className="space-y-6">
//           {pages.length === 0 ? (
//             <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
//               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <CheckSquare className="w-8 h-8 text-gray-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 No Permissions Available
//               </h3>
//               <p className="text-gray-600">
//                 There are no page permissions configured yet.
//               </p>
//             </div>
//           ) : (
//             pages.map((page) => (
//               <div
//                 key={page}
//                 className="bg-white rounded-2xl shadow-lg overflow-hidden"
//               >
//                 {pagePermissions
//                   .filter((p) => p.page === page)
//                   .map((permission) => (
//                     <div key={permission.id}>
//                       {/* Page Header */}
//                       <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//                         <div className="flex items-center justify-between gap-4">
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-2 mb-2">
//                               <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                                 <CheckSquare className="w-4 h-4 text-blue-600" />
//                               </div>
//                               <h2 className="text-xl font-bold text-gray-900 truncate">
//                                 {permission.page}
//                               </h2>
//                             </div>
//                             <div className="flex items-center gap-2 text-sm text-gray-600 ml-10">
//                               <Link className="w-4 h-4 flex-shrink-0" />
//                               <span className="font-medium">URL:</span>
//                               <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono truncate">
//                                 {permission.url}
//                               </code>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-3 flex-shrink-0">
//                             <span className="text-sm font-medium text-gray-700">
//                               Page Access
//                             </span>
//                             <Checkbox
//                               checked={permission.userIds.includes(userId)}
//                               onCheckedChange={(checked) =>
//                                 handlePageToggle(permission, checked)
//                               }
//                               disabled={updating}
//                               className="w-5 h-5"
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       {/* Button Permissions */}
//                       <div className="p-6">
//                         <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
//                           <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
//                           Button Permissions
//                         </h3>
//                         <div className="space-y-2">
//                           {buttonPermissions.filter((b) => b.pages === page)
//                             .length === 0 ? (
//                             <div className="text-center py-8 text-gray-500">
//                               <p className="text-sm">
//                                 No button permissions for this page
//                               </p>
//                             </div>
//                           ) : (
//                             buttonPermissions
//                               .filter((b) => b.pages === page)
//                               .map((btn, index) => (
//                                 <div
//                                   key={btn.id}
//                                   className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 ${
//                                     index % 2 === 0
//                                       ? "bg-gray-50/50"
//                                       : "bg-white"
//                                   }`}
//                                 >
//                                   <div className="flex items-center gap-3">
//                                     <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
//                                       <span className="text-blue-700 font-bold text-sm">
//                                         {btn.button.charAt(0).toUpperCase()}
//                                       </span>
//                                     </div>
//                                     <span className="font-medium text-gray-900">
//                                       {btn.button}
//                                     </span>
//                                   </div>
//                                   <Checkbox
//                                     checked={btn.userIds.includes(userId)}
//                                     onCheckedChange={(checked) =>
//                                       handleButtonToggle(btn, checked)
//                                     }
//                                     disabled={updating}
//                                     className="w-5 h-5"
//                                   />
//                                 </div>
//                               ))
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagementDashboard;

import ApiErrorPage from "@/components/api-error/api-error";
import LoadingBar from "@/components/loader/loading-bar";
import { Checkbox } from "@/components/ui/checkbox";
import { TEAM_API, USERMANAGEMENT } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { ContextPanel } from "@/lib/context-panel";
import {
  Shield,
  Search,
  AlertCircle,
  X,
  Lock,
  Unlock,
  ChevronRight,
} from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ManagementDashboard = () => {
  const { id } = useParams();
  const userId = String(id);
  const { fetchPermissions, fetchPagePermission } = useContext(ContextPanel);
  const staticUsers = useSelector((state) => state.users?.users);
  const user = staticUsers.find((u) => String(u.id) === userId);

  const [buttonPermissions, setButtonPermissions] = useState([]);
  const [pagePermissions, setPagePermissions] = useState([]);
  const [updateError, setUpdateError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPage, setExpandedPage] = useState(null);

  const { trigger, loading: updating } = useApiMutation();

  const {
    data: buttonRes,
    loading: loadingButtons,
    error: errorButtons,
    refetch: refetchButtons,
  } = useGetApiMutation({
    url: USERMANAGEMENT.buttonControl,
    queryKey: ["button-permissions"],
  });

  const {
    data: pageRes,
    loading: loadingPages,
    error: errorPages,
    refetch: refetchPages,
  } = useGetApiMutation({
    url: USERMANAGEMENT.pageControl,
    queryKey: ["page-permissions"],
  });

  useEffect(() => {
    try {
      if (buttonRes?.buttonPermissions) {
        setButtonPermissions(buttonRes.buttonPermissions);
      }
    } catch (error) {
      console.error("Error setting button permissions:", error);
      setUpdateError("Failed to load button permissions");
    }
  }, [buttonRes]);

  useEffect(() => {
    try {
      if (pageRes?.pagePermissions) {
        setPagePermissions(pageRes.pagePermissions);
      }
    } catch (error) {
      console.error("Error setting page permissions:", error);
      setUpdateError("Failed to load page permissions");
    }
  }, [pageRes]);

  const pages = useMemo(
    () =>
      [...new Set(pagePermissions.map((p) => p.page))].filter((page) =>
        page.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [pagePermissions, searchTerm]
  );

  const toggleUserId = (list, checked) => {
    try {
      return checked ? [...list, userId] : list.filter((id) => id !== userId);
    } catch (error) {
      console.error("Error toggling user ID:", error);
      return list;
    }
  };

  const handleButtonToggle = async (permission, checked) => {
    try {
      setUpdateError(null);
      const updatedUserIds = toggleUserId(permission.userIds, checked);

      setButtonPermissions((prev) =>
        prev.map((p) =>
          p.id === permission.id ? { ...p, userIds: updatedUserIds } : p
        )
      );

      await trigger({
        url: TEAM_API.updateButtonById(permission.id),
        method: "put",
        data: {
          pages: permission.pages,
          button: permission.button,
          status: "Active",
          userIds: updatedUserIds.join(","),
        },
      });

      await refetchButtons();
      await fetchPermissions();
    } catch (error) {
      console.error("Error updating button permission:", error);
      setUpdateError("Failed to update button permission");
      setButtonPermissions((prev) =>
        prev.map((p) =>
          p.id === permission.id ? { ...p, userIds: permission.userIds } : p
        )
      );
    }
  };

  const handlePageToggle = async (permission, checked) => {
    try {
      setUpdateError(null);
      const updatedUserIds = toggleUserId(permission.userIds, checked);

      setPagePermissions((prev) =>
        prev.map((p) =>
          p.id === permission.id ? { ...p, userIds: updatedUserIds } : p
        )
      );

      await trigger({
        url: TEAM_API.updatePageById(permission.id),
        method: "put",
        data: {
          page: permission.page,
          url: permission.url,
          status: "Active",
          userIds: updatedUserIds.join(","),
        },
      });

      await refetchPages();
      await fetchPagePermission();
    } catch (error) {
      console.error("Error updating page permission:", error);
      setUpdateError("Failed to update page permission");
      setPagePermissions((prev) =>
        prev.map((p) =>
          p.id === permission.id ? { ...p, userIds: permission.userIds } : p
        )
      );
    }
  };

  const handleRetry = () => {
    refetchButtons();
    refetchPages();
  };

  const isPageActive = (page) => {
    return pagePermissions
      .filter((p) => p.page === page)
      .some((p) => p.userIds.includes(userId));
  };

  const getActiveButtonCount = (page) => {
    return buttonPermissions.filter(
      (b) => b.pages === page && b.userIds.includes(userId)
    ).length;
  };

  const getTotalButtonCount = (page) => {
    return buttonPermissions.filter((b) => b.pages === page).length;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card rounded-lg shadow border border-border p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold text-card-foreground mb-1">
            User Not Found
          </h2>
          <p className="text-sm text-muted-foreground">
            The requested user could not be found in the system.
          </p>
        </div>
      </div>
    );
  }

  if (loadingButtons || loadingPages) return <LoadingBar />;
  if (errorButtons || errorPages) return <ApiErrorPage onRetry={handleRetry} />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-secondary rounded-lg border border-border">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Access Control
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Manage permissions for{" "}
                  <span className="font-semibold text-card-foreground">
                    {user.name}
                  </span>
                </p>
              </div>
            </div>

            {/* Stats in Header */}
            {pages.length > 0 && (
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    {
                      pagePermissions.filter((p) => p.userIds.includes(userId))
                        .length
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">Pages Enabled</p>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    {
                      buttonPermissions.filter((b) =>
                        b.userIds.includes(userId)
                      ).length
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Enabled Button
                  </p>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    {buttonPermissions.length > 0
                      ? Math.round(
                          (buttonPermissions.filter((b) =>
                            b.userIds.includes(userId)
                          ).length /
                            buttonPermissions.length) *
                            100
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Access Button Level
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {updateError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-destructive">Error</h3>
              <p className="text-sm text-destructive/80 mt-1">{updateError}</p>
            </div>
            <button
              onClick={() => setUpdateError(null)}
              className="text-destructive/60 hover:text-destructive transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {pages.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <Lock className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-card-foreground font-medium">No pages found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search filters
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pages.map((page) => {
              const isExpanded = expandedPage === page;
              const pageData = pagePermissions.find((p) => p.page === page);
              const pageButtons = buttonPermissions.filter(
                (b) => b.pages === page
              );
              const isActive = isPageActive(page);
              const activeButtons = getActiveButtonCount(page);
              const totalButtons = getTotalButtonCount(page);

              return (
                <div
                  key={page}
                  className="bg-card rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-sm overflow-hidden"
                >
                  {/* Page Item */}
                  <button
                    onClick={() => setExpandedPage(isExpanded ? null : page)}
                    className="w-full px-5 py-4 hover:bg-secondary/50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                      <div
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${
                          isActive
                            ? "bg-accent shadow-sm shadow-accent/50"
                            : "bg-muted"
                        }`}
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {page}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {pageData?.url}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      {/* Stats */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-md">
                        <span className="text-xs font-semibold text-foreground">
                          {activeButtons}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          of
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                          {totalButtons}
                        </span>
                      </div>

                      {/* Toggle */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          Page Access
                        </span>
                        <Checkbox
                          checked={isActive}
                          onCheckedChange={(checked) => {
                            if (pageData) {
                              handlePageToggle(pageData, checked);
                            }
                          }}
                          disabled={updating}
                          className="w-5 h-5"
                        />
                      </div>

                      {/* Expand */}
                      {totalButtons > 0 && (
                        <ChevronRight
                          className={`w-5 h-5 text-muted-foreground transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </div>
                  </button>

                  {/* Expanded Actions */}
                  {isExpanded && totalButtons > 0 && (
                    <div className="border-t border-border bg-secondary/30 px-5 py-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Actions
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                        {pageButtons.map((btn) => {
                          const isButtonActive = btn.userIds.includes(userId);
                          return (
                            <label
                              key={btn.id}
                              className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/50 hover:bg-secondary/50 transition-all cursor-pointer group"
                            >
                              <Checkbox
                                checked={isButtonActive}
                                onCheckedChange={(checked) =>
                                  handleButtonToggle(btn, checked)
                                }
                                disabled={updating}
                                className="w-5 h-5"
                              />
                              <span className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                                {btn.button}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {pages.length === 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border border-border p-5 hover:border-primary/50 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Pages Enabled
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {
                      pagePermissions.filter((p) => p.userIds.includes(userId))
                        .length
                    }
                  </p>
                </div>
                <Unlock className="w-10 h-10 text-primary/20" />
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-5 hover:border-primary/50 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Actions Enabled
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {
                      buttonPermissions.filter((b) =>
                        b.userIds.includes(userId)
                      ).length
                    }
                  </p>
                </div>
                <ChevronRight className="w-10 h-10 text-primary/20" />
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-5 hover:border-primary/50 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Access Level
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {buttonPermissions.length > 0
                      ? Math.round(
                          (buttonPermissions.filter((b) =>
                            b.userIds.includes(userId)
                          ).length /
                            buttonPermissions.length) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </div>
                <Shield className="w-10 h-10 text-primary/20" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementDashboard;
