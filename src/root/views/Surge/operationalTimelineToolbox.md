# Updating Operational Timeline Toolbox

## SVG(s)

 - From each svg file remove the `width` and `height` properties from the main node.
 
 - Add this property `id="OperationalTimelineToolbox"` to the `*body.svg` file's main node.
    ```html
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 2560" fill="none" id="OperationalTimelineToolbox">
    ```
 - In the `*body.svg` file search for this values:
    - `surge_table/element`
    - `surge_table/tooltips` 

    For each node which contains these ids add this class property `class="svgPointerEvent"`. The result should look like this:
    ```html
    <g id="surge_table/element4_3" class="svgPointerEvent">
    <g id="surge_table/tooltips_top" class="svgPointerEvent">
    ```

## Updating URLs

The URL for each object stored in a separate file in `/src/root/views/Surge/contentData/operation-timeline-content.js`. Search for the object id or the name and you should get the existing URL for that object. If the object does not exists you need to add it to the list.