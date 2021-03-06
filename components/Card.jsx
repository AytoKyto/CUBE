import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { Box, Stack, Button, useMediaQuery } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function MediaControlCard({ resourceData }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card sx={{ display: "flex" }}>
      {resourceData?.thumbnail.url && (
        <CardMedia
          component="img"
          sx={{ width: isMobile ? 125 : 250 }}
          src={resourceData?.thumbnail.url}
          alt={resourceData?.thumbnail.alt}
        />
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Stack spacing={1}>
            <Typography gutterBottom variant="TitreCard" component="div">
              {resourceData?.title}
            </Typography>
            <Stack direction="row" spacing={1}>
              {resourceData?.categories.map((resourceCategory, index) => {
                return (
                  <Typography variant="categoryTypo" key={index}>
                    {`${resourceCategory} `}
                  </Typography>
                );
              })}
            </Stack>
            <Typography variant="DesCard">
              {resourceData?.description}...
            </Typography>
          </Stack>
        </CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mb: 2,
            mr: 2,
            flexGrow: 1,
          }}
        >
          <Link href={`./resource/${resourceData._id}`}>
            <Button variant="borderBtn" size="small" color="primary">
              En savoir plus
            </Button>
          </Link>
        </Box>
      </Box>
    </Card>
  );
}

MediaControlCard.propTypes = {
  resourceData: PropTypes.object,
};
