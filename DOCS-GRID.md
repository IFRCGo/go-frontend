# Grid Documentation

The site uses a custom grid in the grid.scss partial.

## Grid Anatomy

### <a id='header-media-queries'></a>Media Queries
### <a id='header-basics'></a>Grid Basics
### <a id='header-containers'></a>Containers
### <a id='header-rows'></a>Rows
### <a id='header-columns'></a>Columns
### <a id='header-utility-sass'></a>Utility Classes and Sass Mixins

### [Media Queries](#header-media-queries)

(Reference SCSS Partials: variables.scss, mixins.scss)

The site currently uses 4 media query breakpoints

- $media-xsmall: 544px; // Extra Small
- $media-small: 768px;  // Small
- $media-medium: 992px; // Medium
- $media-large: 1440px; // Large

***Notes***
- The site suggests using **min-width media queries** (from smaller to larger screens widths)
- Max-width media queries can be used as needed
- The site also has other media query mixins outside the ones above, suffixed with `-up`, which will be slowly phased out. Avoid using them.
```
// For example:
@include media(xsmall-up) {}
@include media(small-up) {}
```


Min-width media queries mixins can be used in the following manner:

```

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

```

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

### [Grid Basics](#header-basics)

(Reference SCSS Partials: variables.scss, grid.scss, utilities.scss)

- The grid uses flexbox to layout grid items
- The grid uses a standard 12 column paradigm, with percentage values
- The grid structure is usually:
(container > row > column) + grid helpers

### [Containers](#header-containers)
(Reference SCSS Partials: variables.scss, grid.scss)

- Container maximum widths are equal to those of the media queries.
- The standard container for a grid is `container-lg`. This provides the maximum size container (1440px), with a large horizontal padding of nearly 100px on desktop.
- Sometimes, you may need to use smaller containers for certain sections. On those rare occasions, here is the list of containers.

```
// Container: Default / Large
.container-lg {
}

// Container: Medium
.container-mid {
}

// Container: Small
.container-sm {
}

// Container: Extra Small
.container-xs {
}

// Container: Full Width
.container-full {
  @include container($max-width: false);
}

// Container: Reset Padding for Large Container: Modifier

.container--padding-reset {
  padding-left: $grid-gutter;
  padding-right: $grid-gutter;
}

```

***Notes***
On the occasions when you need to reset the large paddings of any container, you can use the additional modifier class `container--padding-reset`.





