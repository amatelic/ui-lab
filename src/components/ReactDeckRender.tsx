import { Fragment, useEffect, useState } from "react";
// import { DeckLayer } from "../utils/deckgl.utils";
import { MapView } from "@deck.gl/core";
import { useMapEvent, useMapEvents } from "react-leaflet";
import { MVTLayer } from "@deck.gl/geo-layers";
import { Map } from "leaflet";
import { DeckLayer } from "../utils/deckgl";
import { GeoJsonLayer, ArcLayer } from "@deck.gl/layers";

type onAfterRender = (ctx: any, layer: DeckLayer[]) => void;
type onError = (error: Error, layer: DeckLayer) => void;

interface LayerService {
  onAfterRender: onAfterRender;
  onError: onError;
}

function createNewDeckGlLayer(
  layers: any[],
  onAfterRender: onAfterRender,
  onError: onError,
) {
  return new DeckLayer({
    views: [new MapView({ repeat: true })],
    layers: layers,
    controller: true,
    onAfterRender: (ctx) => {
      onAfterRender(ctx, layers);
    },
    onError,
    getTooltip: ({ object }) => {
      return object && object.properties.name;
    },
  });
}

function useLayers(service: LayerService) {
  // useBaseFilter
  const map = useMapEvents({});
  const [activeLayer, setLayer] = useState<Record<string, DeckLayer>>({});

  function addLayers<A>(layers: MVTLayer<A>[]): DeckLayer {
    const deckGlLayer = createNewDeckGlLayer(
      layers,
      service.onAfterRender,
      service.onError,
    );

    if (map) {
      map.addLayer(deckGlLayer);
    }

    setLayer((prev) => ({ ...prev, [deckGlLayer.props.id]: deckGlLayer }));

    return deckGlLayer;
  }

  function removeLayers<A>(layer: DeckLayer) {
    if (map) {
      map.removeLayer(layer);
    }
  }

  function clearLayerById(id: string) {
    if (map && activeLayer[id]) {
      map.removeLayer(activeLayer[id]);
      setLayer((prev) => {
        const newLayers = { ...prev };
        delete newLayers[id];
        return newLayers;
      });
    }
  }

  return {
    addLayers,
    removeLayers,
    clearLayerById,
  };
}

// change ui to add support for full screen

const AIR_PORTS =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson";

interface Payload {
  payload: {
    data: { url: string } | { fetureColllection: any[]; type: string };
  };
}

export const ReactDeckRender = ({ payload }: Payload) => {
  const [isLoading, setIsLoading] = useState(true);
  let data = payload.data;

  if (data && data.url) {
    data = data.url;
  }

  const activeLayers: MVTLayer<unknown>[] = [
    new GeoJsonLayer({
      id: "data",
      data: data,
      // Styles
      pickable: true,

      filled: true,
      pointRadiusMinPixels: 2,
      pointRadiusScale: 2000,
      getPointRadius: (f) => 11 - f.properties.scalerank,
      getFillColor: [200, 0, 80, 180],
    } as any),
  ];
  const service = useLayers({
    onAfterRender: (ctx, layers) => {
      const hasRenderd = layers
        .filter((l) => l)
        .some((layer) => !(layer && layer.isLoaded));
      //isLoading
      setIsLoading(hasRenderd);
      const data = {} as any;
    },
    onError: (error, layer) => {
      console.log(error);
      setIsLoading(false);
    },
  });

  // Other Layers
  useEffect(() => {
    const cleanLayer = service.addLayers(activeLayers);
    return () => {
      service.removeLayers(cleanLayer);
    };
  }, [activeLayers.length]);

  return (
    <Fragment>
      {isLoading ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 w-full items-center justify-center">
          <div className="flex gap-5 rounded-md bg-white px-2 py-2">
            <svg
              className="h-6 w-6 animate-spin text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Is loading</span>
          </div>
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
};
