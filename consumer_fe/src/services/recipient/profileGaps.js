/** Pure: which profile sections a recipient still has to complete. */
export function getProfileGaps(recipient) {
  const needsLocation = !recipient?.region || !recipient?.city;
  const needsDetails = !recipient?.interests || !recipient?.email;

  return {
    needsLocation,
    needsDetails,
    count: Number(needsLocation) + Number(needsDetails),
  };
}
