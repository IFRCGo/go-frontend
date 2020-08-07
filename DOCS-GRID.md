# Grid Documentation

The site uses a custom grid in the grid.scss partial.

## Grid Anatomy

### [Media Queries](#header-media-queries)
### [Grid Basics](#header-basics)
### [Containers](#header-containers)
### [Rows](#header-rows)
### [Columns](#header-columns)
### [Utility Classes and Mixins](#header-utilities)
### [Examples](#header-examples)

### <a id='header-media-queries'></a>Media Queries

*Reference files: _variables.scss, _mixins.scss*

The site currently uses 5 media query breakpoints

- $media-xsmall: 544px; // Extra Small
- $media-small: 768px;  // Small
- $media-medium: 992px; // Medium
- $media-desktop: 1300px; // Desktop // RARELY USED
- $media-large: 1440px; // Large

***Notes***
- Using **min-width media queries** is recommended.
- Max-width media queries can be used as needed.
- The desktop and large media query are rarely used.
- The desktop media query does not have containers and columns associated with it, since usage is rare.
- The site also has other media query mixins outside the ones above, suffixed with `-up`, which will be slowly phased out. Avoid using them.
```scss
// Avoid usage of media queries suffixed with -up:
@include media(xsmall-up) {}
@include media(small-up) {}
@include media(medium-up) {}
@include media(large-up) {}
```


Min-width media queries mixins can be used in the following manner:

```scss
@include media(xsmall) {
  ...
}

@include media(small) {
  ... 
}

@include media(medium) {
  ...
}

@include media(large) {
  ...
}
```

Max-width media queries mixins can be used in the following manner:

```scss
@include media(xsmall-down) {
  ...
}

@include media(small-down) {
  ... 
}

@include media(medium-down) {
  ...
}

@include media(large-down) {
  ...
}
```

### <a id='header-basics'></a>Grid Basics

*Reference files: _variables.scss, _grid.scss, _utilities.scss*

- The grid uses a standard 12 column layout.
- Flexbox is used to layout grid items.
- The grid structure is usually:
  [Container > (Row + Flex) > Column) + Grid Helpers]

### <a id='header-containers'></a>Containers
*Reference files: _variables.scss, _grid.scss*

- Container widths are equal to those of the media queries.
- The standard container for a grid is `container-lg`. This provides the maximum size container (1440px), with a large horizontal padding of nearly 100px on desktop.
- On rare occasions, you may need to use smaller containers.

```scss
// Container: Large (Default)
.container-lg

// Container: Medium
.container-mid

// Container: Small
.container-sm

// Container: Extra Small
.container-xs

// Container: Full Width
.container-full

// Container: Reset Padding for Container: Modifier

.container--padding-reset

// Container: Uncenter: Modifier

.container--uncenter
```

***Notes***
- If you need to reset the large paddings of `container-lg`, you can use the additional modifier class `container--padding-reset`. This is occasionally done inside certain `Fold` elements nested inside containers.
- If you need the container to NOT be centered, use the modifier class `container--uncenter`.
- You can also use the container mixin if you need to further customise the container. It has 3 optional parameters for maximum width, centering and size of gutters. 


### <a id='header-rows'></a>Rows

*Reference files: _variables.scss, _grid.scss*

- A row is always wrapped within a container.
- Rows use negative margins to offset the first and last column's left and right gutter respectively.
- Rows are usually clubbed with flexbox helper classes for layout. Check out the [Examples](#header-examples) section for more.

```scss
// Row: Default Gutter
.row

// Row: Small Gutter
.row-sm

// Row: Large Gutter
.row-lg
```

***Notes***
- You can also use the row mixin if you need to further customise the row. It has 1 optional parameter for size of gutters. 


### <a id='header-columns'>Columns</a>

*Reference files: _variables.scss, _grid.scss*

- A column is always wrapped within a row.
- Columns use horizontal padding as gutters.
- Columns also have helper classes with widths in percentages.

```scss
// Column: Default Gutter
.col

// Column: Small Gutter
.col-sm

// Column: Large Gutter
.col-lg
```

***Notes***
- You can also use the column mixin if you need to further customise the column. It has 3 optional parameters for width, size of gutters and vertical spacing. 
- The site contains some residual mixins from the older Jeet Grids system like `@include column(4/12)`. These will be phased out gradually and can be ignored for now.

### <a id='header-utilities'></a>Utility Classes and Mixins

#### Utility Classes and Mixins: Flexbox
*Reference files: _variables.scss, _utlities.scss, _grid.scss*
- The site uses flexbox helpers to layout items.

```scss
// The flex helper changes the display to flex with flex wrap.
// Add these helpers to rows at the correct breakpoint.
  // More info in the Examples section

.flex
.flex-xs
.flex-sm
.flex-mid
.flex-lg
```

***Notes***
- The grid section contains additional flexbox helpers to prevent wrapping, align flex items vertically, and justify and align helpers.

#### Utility Classes and Mixins: Spacing and Margins

- The site uses padding and margin helpers for left, right, top and bottom sides, as well as horizontal, vertical and all sides.
- The spacing and margin variables are proportional (`$spacing-2` is double of `$spacing`, `$spacing-half` is half of `$spacing` and so on)
- These utilities can be used for adding white space across the site, as well as adding vertical spacing to columns, for example.

```scss
// Spacing: Variables
$spacing // Default (12px)
$spacing-2
$spacing-3
$spacing-4
$spacing-5
$spacing-half
```

```scss
// Spacing: Classes: USES PADDING

.spacing    // All sides
.spacing-v  // Vertical i.e. Top and Bottom
.spacing-h  // Horizontal i.e. Left and Right
.spacing-t  // Top
.spacing-l  // Left
.spacing-r  // Right
.spacing-b  // Bottom


// Spacing 2
.spacing-2
.spacing-2-v
.spacing-2-h
.spacing-2-t
.spacing-2-l
.spacing-2-r
.spacing-2-b


// Spacing 3
.spacing-3
.spacing-3-v
.spacing-3-h
.spacing-3-t
.spacing-3-l
.spacing-3-r
.spacing-3-b


// Spacing 4
.spacing-4
.spacing-4-v
.spacing-4-h
.spacing-3-t
.spacing-4-l
.spacing-4-r
.spacing-4-b


// Spacing 5
.spacing-5
.spacing-5-v
.spacing-5-h
.spacing-5-t
.spacing-5-l
.spacing-5-r
.spacing-5-b

// Spacing Half
.spacing-half
.spacing-half-v
.spacing-half-h
.spacing-half-t
.spacing-half-l
.spacing-half-r
.spacing-half-b
```

```scss
// Margin: Classes: USES Margins

.margin    // All sides
.margin-v  // Vertical i.e. Top and Bottom
.margin-h  // Horizontal i.e. Left and Right
.margin-t  // Top
.margin-l  // Left
.margin-r  // Right
.margin-b  // Bottom


// Margin 2
.margin-2
.margin-2-v
.margin-2-h
.margin-2-t
.margin-2-l
.margin-2-r
.margin-2-b


// Margin 3
.margin-3
.margin-3-v
.margin-3-h
.margin-3-t
.margin-3-l
.margin-3-r
.margin-3-b


// Margin 4
.margin-4
.margin-4-v
.margin-4-h
.margin-3-t
.margin-4-l
.margin-4-r
.margin-4-b


// Margin 5
.margin-5
.margin-5-v
.margin-5-h
.margin-5-t
.margin-5-l
.margin-5-r
.margin-5-b


// Margin: Half
.margin-half
.margin-half-v
.margin-half-h
.margin-half-t
.margin-half-l
.margin-half-r
.margin-half-b
```

```scss
// Padding Reset
// Resets padding to zero

.padding-reset   // Resets padding on all sides

.padding-t-reset // Resets top padding

.padding-b-reset // Resets bottom padding

.padding-l-reset // Resets left padding

.padding-r-reset // Resets right padding


//Margin Reset
// Resets margins to zero

.margin-reset   // Resets margins on all sides

.margin-t-reset // Resets top margin

.margin-b-reset // Resets bottom margin

.margin-l-reset // Resets left margin

.margin-r-reset // Resets right margin
```

***Notes***

- The site also contains variables and utility classes like $global-spacing, .global-spacing, $global-margin, global-margin, etc. These will be phased out gradually.

### <a id='header-examples'></a>Examples

- Example 1
```jsx
// 1 column (Default)
// 2 columns (Xsmall Breakpoint)
// 3 columns (Small Breakpoint)
// 4 Columns (Medium Breakpoint)

<div className='container-lg'>
  <div className='row flex-xs'>
    <div className='col col-6-xs col-4-sm col-3-mid'>
    </div>
    <div className='col col-6-xs col-4-sm col-3-mid'>
    </div>
    <div className='col col-6-xs col-4-sm col-3-mid'>
    </div>
    <div className='col col-6-xs col-4-sm col-3-mid'>
    </div>
  </div>
</div>
```

- Example 2
```jsx
// 1 column (Default)
// 2 columns (Large Breakpoint) with vertical margins

<div className='container-lg'>
  <div className='row flex-lg'>
    <div className='col col-6-lg margin-v'>
    </div>
    <div className='col col-6-lg margin-v'>
    </div>
  </div>
</div>
```

- Example 3
```jsx
// 2 columns: 1st is 25%, 2nd is 75%
// Columns have small gutters

<div className='container-lg'>
  <div className='row-sm flex'>
    <div className='col-sm col-3'>
    </div>
    <div className='col-sm col-9'>
    </div>
  </div>
</div>
```

- Example 4
```jsx
// 2 columns: 1st is 33.33%, 2nd is 66.66%
// Columns have large gutters

<div className='container-lg'>
  <div className='row-lg flex'>
    <div className='col-lg col-4'>
    </div>
    <div className='col-lg col-8'>
    </div>
  </div>
</div>
```

- Example 5
```jsx
// Use Sass mixins instead of grid classes
// 2 columns of equal width at small breakpoint
<div className='container-demo-class'>
  <div className='row-demo-class'>
    <div className='col-demo-class'>
    </div>
    <div className='col-demo-class'>
    </div>
  </div>
</div>
```
```scss
// Example Sass mixins and helpers
.container-demo-class {
  @include container-lg;
}

.row-demo-class {
  @include row;

  @include media(small) {
    @include flex;
  }
}

.col-demo-class {
  @include media(small) {
    @include col(50%);  
    // OR
    // @include col(percentage(6/12));
  }
}
```

- Example 6
```jsx
// Equal height columns
// 3 columns of equal height at medium breakpoint

// Note: Inline styles added only for demo

// Solution: Simply add a class of flex to the columns.
// If required, added a helper for the flex-direction to be column instead of the default *row*.

<div className='container-lg'>
  <div className='row flex-mid'>
    <div className='col col-4-mid flex'>
      <div className='box__demo' style={{background: '#fff', padding: '20px'}}>
        <p>Smaller Paragraph to demo equal heights</p>
      </div>
    </div>
    <div className='col col-4-mid flex'>
      <div className='box__demo' style={{background: '#fff', padding: '20px'}}>
        <p>Smaller Paragraph to demo equal heights</p>
      </div>
    </div>
    <div className='col col-4-mid flex'>
      <div className='box__demo' style={{background: '#fff', padding: '20px'}}>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    </div>
  </div>
</div>
```