export const checkPermission = (userId, button, permissions = []) => {
  return permissions.some(
    (perm) =>
      perm.button === button &&
      perm.status === "Active" &&
      perm.userIds?.includes(String(userId))
  );
};
