import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";

export default function MarkerBrowser({
  map,
  isDataFetching,
  markerOpenPopup,
  markersRef,
  updateMarkersState,
  markers,
  setMarkers,
}) {
  const columnsMarkers = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
      headerClassName: "marker-browser-headers",
      headerAlign: "center",
    },
    {
      field: "lng",
      headerName: "Lng",
      type: "number",
      width: 100,
      headerClassName: "marker-browser-headers",
      headerAlign: "center",
    },
    {
      field: "lat",
      headerName: "Lat",
      type: "number",
      width: 100,
      headerClassName: "marker-browser-headers",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 100,
      headerClassName: "marker-browser-headers",
      headerAlign: "center",
      renderCell: (params) => {
        const clickedMarker = params.row;

        const handleDelete = () => {
          markersRef.current.map((marker) => {
            if (marker.id === clickedMarker.id) {
              marker.marker
                .getElement()
                .removeEventListener("click", markerOpenPopup);
              marker.marker.remove();
            }
          });
          markersRef.current = markersRef.current.filter(
            (marker) => marker.id !== clickedMarker.id
          );
          updateMarkersState(markersRef, setMarkers);
        };

        const handleGoTo = () => {
          map.current.flyTo({
            center: clickedMarker.marker.getLngLat(),
            zoom: 7,
            essential: false,
          });
          markerOpenPopup(clickedMarker);
        };

        return (
          <>
            <DeleteIcon onClick={handleDelete} style={{ cursor: "pointer" }} />
            <LocationSearchingIcon
              onClick={handleGoTo}
              style={{ cursor: "pointer" }}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="marker-browser">
      <DataGrid
        rows={markers}
        columns={columnsMarkers}
        getRowHeight={() => 30}
        columnHeaderHeight={40}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 50 } },
        }}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        disableRowSelectionOnClick={true}
        disableColumnFilter={true}
        disableColumnMenu={true}
        sx={{
          borderColor: "primary.light",
          boxShadow: 2,
          border: 1,
          fontFamily: "monospace",
        }}
        localeText={
          isDataFetching
            ? { noRowsLabel: "Loading data..." }
            : { noRowsLabel: "No markers saved" }
        }
      />
    </div>
  );
}
