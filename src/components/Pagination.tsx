import { Pagination, PaginationItem, useMediaQuery } from "@mui/material";
import {
  gridFilteredTopLevelRowCountSelector,
  gridPageSelector,
  gridPageSizeSelector,
  useGridApiContext,
  useGridRootProps,
  useGridSelector,
} from "@mui/x-data-grid";

const getPageCount = (rowCount: number, pageSize: number): number => {
  if (pageSize > 0 && rowCount > 0) {
    return Math.ceil(rowCount / pageSize);
  }

  return 0;
};

const CustomPagination = () => {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
  const visibleTopLevelRowCount = useGridSelector(
    apiRef,
    gridFilteredTopLevelRowCountSelector
  );
  const pageCount = getPageCount(
    rootProps.rowCount ?? visibleTopLevelRowCount,
    pageSize
  );
  const isLargeScreens = useMediaQuery("(min-width:600px)");
  return (
    <Pagination
      variant="outlined"
      shape="rounded"
      showFirstButton={isLargeScreens}
      showLastButton={isLargeScreens}
      page={page + 1}
      count={pageCount}
      siblingCount={1}
      hideNextButton={!isLargeScreens}
      hidePrevButton={!isLargeScreens}
      size={isLargeScreens ? "medium" : "small"}
      sx={{
        "& .MuiPaginationItem-root": {
          color: "#fff",
          borderColor: "#fff",
        },
        "& .MuiPaginationItem-root.Mui-selected": {
          color: "black",
          border: "1px solid white",
          backgroundColor: "white",
        },
      }}
      // @ts-expect-error
      renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
      onChange={(_: React.ChangeEvent<unknown>, value: number) =>
        apiRef.current.setPage(value - 1)
      }
    />
  );
};

export default CustomPagination;
