import React, { useState, memo, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from '@react-google-maps/api';
import useSupercluster from 'use-supercluster';
import { useGetLocations } from '@/features/boards/hooks';

const containerStyle = {
  width: '100%',
  height: '100%'
};

interface BoardMapProps {
  boardId: number;
}

const BoardMap: React.FC<BoardMapProps> = memo(({ boardId }) => {
  const { data: locations = [], isLoading, error } = useGetLocations(boardId);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);
  const [zoom, setZoom] = useState(10);

  if (!apiKey) {
    return <div aria-live="assertive">Error: Google Maps API key not set.</div>;
  }

  if (isLoading) return <div aria-live="polite">Loading locations...</div>;
  if (error) return <div aria-live="assertive">Error loading locations: {error.message}</div>;

  const points = useMemo(() => locations.map(loc => ({
    type: "Feature" as const,
    properties: { cluster: false, locationId: loc.id, name: loc.name },
    geometry: {
      type: "Point" as const,
      coordinates: [loc.lng, loc.lat]
    }
  })), [locations]);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 17 }
  });

  const onLoad = (map: google.maps.Map) => {
    setMapRef(map);
    if (locations.length > 0) {
      const latLngBounds = new google.maps.LatLngBounds();
      locations.forEach(loc => latLngBounds.extend({ lat: loc.lat, lng: loc.lng }));
      map.fitBounds(latLngBounds);
    }
  };

  const onBoundsChanged = () => {
    if (mapRef) {
      const b = mapRef.getBounds();
      if (b) {
        const ne = b.getNorthEast();
        const sw = b.getSouthWest();
        setBounds([sw.lng(), sw.lat(), ne.lng(), ne.lat()]);
      }
      setZoom(mapRef.getZoom() || 10);
    }
  };

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        onBoundsChanged={onBoundsChanged}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <MarkerClusterer>
          {(clusterer) => (
            <>
              {clusters.map(cluster => {
                const [longitude, latitude] = cluster.geometry.coordinates;
                const { cluster: isCluster, point_count: pointCount, name } = cluster.properties;

                if (isCluster) {
                  return (
                    <Marker
                      key={`cluster-${cluster.id}`}
                      position={{ lat: latitude, lng: longitude }}
                      clusterer={clusterer}
                      icon={{
                        url: `https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png`,
                        scaledSize: new google.maps.Size(30 + pointCount * 5, 30 + pointCount * 5),
                      }}
                      onClick={() => {
                        const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
                        mapRef?.setZoom(expansionZoom);
                        mapRef?.panTo({ lat: latitude, lng: longitude });
                      }}
                      aria-label={`Cluster of ${pointCount} locations`}
                    />
                  );
                }

                return (
                  <Marker
                    key={`location-${cluster.properties.locationId}`}
                    position={{ lat: latitude, lng: longitude }}
                    clusterer={clusterer}
                    title={name}
                    aria-label={`Location: ${name}`}
                  />
                );
              })}
            </>
          )}
        </MarkerClusterer>
      </GoogleMap>
    </LoadScript>
  );
});

export default BoardMap;