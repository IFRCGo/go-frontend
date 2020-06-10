export default function exportMap (mapInstance) {
  if (mapInstance) {
    const uri = mapInstance.getCanvas().toDataURL();
    var link = document.createElement('a');
    link.download = 'map.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
