import React from "react";
import PropTypes from "prop-types";
import { Stack } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import WarningIcon from "@mui/icons-material/Warning";

export default function IconCell({ isValid, isReported }) {
  if (isValid) {
    return (
      <Stack direction="row" alignItems={"center"} sx={{ minWidth: "100px" }}>
        <CheckIcon sx={{ color: "gov.lightMenthe", mr: 1 }} />
        Actif
      </Stack>
    );
  }

  if (!isValid && isValid !== null) {
    return (
      <Stack direction="row" alignItems={"center"} sx={{ minWidth: "100px" }}>
        <HourglassEmptyIcon sx={{ color: "gov.lightTuile", mr: 1 }} />
        En attente
      </Stack>
    );
  }

  if (isReported) {
    return (
      <Stack direction="row" alignItems={"center"} sx={{ minWidth: "100px" }}>
        <WarningIcon sx={{ color: "gov.red", mr: 1 }} />
        En attente de modération
      </Stack>
    );
  }

  return (
    <Stack direction="row" alignItems={"center"} justifyContent="center">
      -
    </Stack>
  );
}

IconCell.defaultProps = {
  isValid: null,
  isReported: null,
};

IconCell.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};
