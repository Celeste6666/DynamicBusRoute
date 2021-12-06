export default function convertToGeoJson(Geometry) {
  const reg1 = /\(/gi;
  const reg2 = /\)/gi;
  const index = Geometry.indexOf('(');
  let newGeometry = Geometry.substring(index);
  newGeometry = newGeometry.replace(reg1, '[[');
  newGeometry = newGeometry.replace(reg2, ']]');
  newGeometry = newGeometry.replaceAll(/(,)\s|(,)/g, '],[');
  newGeometry = newGeometry.replaceAll(' ', ',');
  newGeometry = JSON.parse(newGeometry);
  newGeometry.forEach((arr) => {
    arr.reverse();
  });
  return {
    type: 'LineString',
    coordinates: newGeometry,
  };
}
