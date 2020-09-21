import React, { useContext } from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import {
  _cs,
  addSeparator,
} from '@togglecorp/fujs';

import { getDistrictsForCountryPF } from '#actions';

import DownloadButton from '#components/map/common/download-button';
import MapHeader from '#components/map/common/map-header';
import MapFooter from '#components/map/common/map-footer';

import newMap from '#utils/get-new-map';
import LanguageContext from '#root/languageContext';

import { getCountryMeta } from '#utils/get-country-meta';
import { countriesSelector } from '#selectors';
import turfBbox from '@turf/bbox';
import { countriesGeojsonSelector } from '../../selectors';
import { countryLabels } from '../../utils/country-labels';

const emptyList = [];
const emptyObject = {};

const getResultsFromResponse = (response, defaultValue = emptyList) => {
  const {
    fetched,
    data
  } = response || emptyObject;

  if (!fetched || !data || !data.results || !data.results.length) {
    return defaultValue;
  }

  return response.data.results;
};

const ProjectDetailElement = ({
  label,
  value,
  className,
}) => (
  <div className={_cs(className, 'popover-project-detail-element')}>
    <div className='popover-project-detail-element-label'>
      {label}
    </div>
    :
    <div className='popover-project-detail-element-value'>
      {value}
    </div>
  </div>
);

const ProjectDetail = (p) => {
  const {
    project: {
      name: projectName,
      reporting_ns_detail: {
        society_name: reportingNationalSocietyName,
      },
      start_date: startDate,
      end_date: endDate,
      budget_amount: budget,
      status_display,
      programme_type_display,
      primary_sector_display,
      modified_at: modifiedAt = '-',
      project_districts_detail: districts,
    },
  } = p;

  const { strings } = useContext(LanguageContext);
  return (
    <div className='popover-project-detail'>
      <ProjectDetailElement
        className='popover-project-detail-last-updated'
        label={strings.threeWMapLastUpdate}
        value={modifiedAt.substring(0, 10)}
      />
      <div className='popover-project-detail-heading'>
        { reportingNationalSocietyName } : { projectName }
      </div>
      <ProjectDetailElement
        label={strings.threeWMapStatus}
        value={`${status_display} (${startDate} to ${endDate})`}
      />
      <ProjectDetailElement
        label={strings.threeWMapSector}
        value={primary_sector_display}
      />
      { districts && districts.length > 0 && (
        <ProjectDetailElement
          label={strings.threeWMapRegions}
          value={districts.map(d => d.name).join(', ')}
        />
      )}
      <ProjectDetailElement
        label={strings.threeWMapProgrammeType}
        value={programme_type_display}
      />
      <ProjectDetailElement
        label={strings.threeWMapBudget}
        value={addSeparator(budget)}
      />
    </div>
  );
};

class ThreeWMap extends React.PureComponent {
  constructor (props) {
    super(props);

    this.mapContainerRef = React.createRef();
    this.mapLoaded = false;
  }

  componentDidMount () {
    const { current: mapContainer } = this.mapContainerRef;
    this.props._getDistricts(this.props.countryId);
    this.map = newMap(
      mapContainer,
      'mapbox://styles/go-ifrc/ck1izjgrs016k1cmxwekow9m0',
    );

    this.map.setMaxZoom(7);
    this.map.on('load', this.handleMapLoad);
    this.map.on('click', this.handleMapClick);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    const {
      countryId: oldCountryId,
      projectList: oldProjectList,
      districtsResponse: oldDistrictsResponse,
    } = this.props;

    const {
      countryId,
      projectList,
      districtsResponse,
    } = nextProps;

    if (countryId !== oldCountryId) {
      this.props._getDistricts(this.props.countryId);
    }

    if (countryId !== oldCountryId || projectList !== oldProjectList || oldDistrictsResponse !== districtsResponse) {
      if (this.mapLoaded) {
        this.fillMap(countryId, projectList, districtsResponse);
      }
    }
  }

  handleMapLoad = () => {
    this.mapLoaded = true;

    const {
      countryId,
      projectList,
      districtsResponse,
    } = this.props;

    // add custom labels
    if (this.props.countriesGeojson) {
      this.map.addSource('countryCentroids', {
        type: 'geojson',
        data: this.props.countriesGeojson
      });

      // hide stock labels
      this.map.setLayoutProperty('icrc_admin0_labels', 'visibility', 'none');

      this.map.addLayer(countryLabels);
    }

    this.fillMap(countryId, projectList, districtsResponse);
  }

  resetBounds = (countryId, largePadding = false) => {
    const countryMeta = getCountryMeta(countryId, this.props.countries);
    const bbox = turfBbox(countryMeta.bbox);
    this.map.fitBounds(
      bbox,
      {
        padding: {
          top: largePadding ? 100 : 20,
          right: largePadding ? (280 + 10) : 90,
          bottom: largePadding ? 80 : 20,
          left: 10,
        }
      }
    );
  }

  fillMap = (countryId, projectList, districtsResponse) => {
    const districtList = getResultsFromResponse(districtsResponse[countryId], emptyList);

    this.resetBounds(countryId);

    const allDistrictList = projectList.map(d => d.project_districts).flat();
    const allDistricts = allDistrictList.reduce((acc, val) => {
      if (!acc[val]) {
        acc[val] = 0;
      }
      ++acc[val];
      return acc;
    }, {});

    const state = districtList.map(d => ({
      id: d.id,
      count: allDistricts[d.id] || 0,
    }));

    const maxProjects = Math.max(0, ...Object.values(allDistricts));
    let opacityProperty;

    const upperShift = 0.2;
    const lowerShift = 0.1;

    if (state.length > 0) {
      opacityProperty = [
        'match',
        ['get', 'OBJECTID'],

        ...state.map(district => {
          const value = (maxProjects !== 0)
            ? (lowerShift + (district.count / maxProjects) * (1 - upperShift - lowerShift))
            : lowerShift;

          return [
            district.id,
            value,
          ];
        }).flat(),

        0,
      ];
    } else {
      opacityProperty = 0;
    }

    this.map.setPaintProperty(
      'adm1',
      'fill-opacity',
      opacityProperty,
    );
  }

  handleMapClick = (e) => {
    const { projectList } = this.props;
    const projectDistrictList = [...new Set(projectList.map(d => d.project_districts).flat())];

    const features = this.map.queryRenderedFeatures(
      e.point,
      {
        layers: ['adm1'],
        filter: [
          'in',
          'OBJECTID',
          ...projectDistrictList,
        ],
      },
    );

    this.showDistrictDetailPopover(this.map, e.lngLat, features[0]);
  }

  showDistrictDetailPopover = (
    map,
    clickLocation,
    feature,
  ) => {
    if (!feature) {
      return;
    }

    const { projectList } = this.props;
    const popoverContent = document.createElement('div');
    const {
      properties,
    } = feature;

    const {
      OBJECTID: districtId,
      Admin01Nam: title,
    } = properties;

    const projectsInCurrentDistrict = projectList
      .filter(p => p.project_districts && p.project_districts.length > 0)
      .filter(p => p.project_districts.findIndex(d => d === districtId) !== -1);

    const numProjects = projectsInCurrentDistrict.length;

    render(
      (
        <div className='three-w-map-district-detail-popover'>
          <h4 className='detail-popover-title'>
            { title } ({numProjects} { numProjects > 1 ? 'projects' : 'project' })
          </h4>
          <div className='detail-popover-content'>
            { projectsInCurrentDistrict.map(p => (
              <ProjectDetail
                project={p}
                key={p.id}
              />
            ))}
          </div>
        </div>
      ),
      popoverContent,
    );

    if (this.popover) {
      this.popover.remove();
    }

    this.popover = new mapboxgl.Popup({ closeButton: false })
      .setLngLat(clickLocation)
      .setDOMContent(popoverContent.children[0])
      .addTo(map);
  }

  render () {
    const { strings } = this.context;

    return (
      <div className='three-w-map-wrapper'>
        <MapHeader downloadedHeaderTitle={strings.threeWMapProjects} />
        <div
          ref={this.mapContainerRef}
          className='three-w-map'
        />
        <DownloadButton
          mapContainerClassName='three-w-map-vis'
          setZoomToDefault={() => this.resetBounds(this.props.countryId, true)}
        />
        <MapFooter />
      </div>
    );
  }
}

ThreeWMap.contextType = LanguageContext;

const selector = (state, ownProps) => ({
  districtsResponse: state.districts,
  countries: countriesSelector(state),
  countriesGeojson: countriesGeojsonSelector(state)
});

const dispatcher = dispatch => ({
  _getDistricts: (...args) => dispatch(getDistrictsForCountryPF(...args)),
});

export default connect(
  selector,
  dispatcher
)(ThreeWMap);
