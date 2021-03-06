import React, { useState } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import Layout from "../components/Layout/Layout";
import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import DataTable from "../components/BackOffice/DataTable";
import apiService from "../services/apiService";
import StatsTab from "../components/BackOffice/StatsTab";

export default function AdminPanel({ resources, comments, users, chartData }) {
  const [value, setValue] = useState("0");

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  // Formate les trois tableaux de données pour afficher les mênmes infos dans les panneaux
  // Essentiellement pour la gestion de l áffichage des dates
  const formatData = () => {
    switch (value) {
      case "0":
        return resources.map((r) => {
          return {
            ...r,
            createdAt: format(new Date(r.createdAt), "dd/MM/yyyy"),
          };
        });

      case "1":
        return comments.map((c) => {
          return {
            ...c,
            createdAt: format(new Date(c.createdAt), "dd/MM/yyyy"),
          };
        });

      case "2":
        return users.map((u) => {
          return {
            ...u,
            title: u.email,
            createdAt: format(new Date(u.createdAt), "dd/MM/yyyy"),
          };
        });

      default:
        return [];
    }
  };

  return (
    <Layout title="Cube | Admin" withSidebar={false}>
      <Typography variant="h1" sx={{ color: "gov.blue", mt: 2 }}>
        Administration
      </Typography>
      <Box sx={{ width: "100%", typography: "body1", minHeight: "70vh" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Gestion des publications" value={"0"} />
              <Tab label="Gestion des commentaires" value={"1"} />
              <Tab label="Gestion des utilisateurs" value={"2"} />
              <Tab label="Statistiques" value={"3"} />
            </TabList>
          </Box>
          <TabPanel value={"0"}>
            <DataTable
              title="Ressources"
              data={formatData(resources)}
              type="resources"
            />
          </TabPanel>
          <TabPanel value="1">
            <DataTable
              title="Commentaires"
              data={formatData(comments)}
              type="comments"
            />
          </TabPanel>
          <TabPanel value="2">
            <DataTable
              title="Utilisateurs"
              data={formatData(users)}
              type="users"
            />
          </TabPanel>
          <TabPanel value="3">
            <StatsTab chartData={chartData} />
          </TabPanel>
        </TabContext>
      </Box>
    </Layout>
  );
}

AdminPanel.propTypes = {
  resources: PropTypes.array,
  comments: PropTypes.array,
  users: PropTypes.array,
  chartData: PropTypes.object,
};

export async function getServerSideProps() {
  let resources = [];
  let users = [];
  let comments = [];
  let chartData = [];

  try {
    const fetchedResources = await apiService.getItems("resources");
    const fetchedUsers = await apiService.getItems("users");
    const fetchedComments = await apiService.getItems("comments");
    const fetchedData = await apiService.getItems("stats");

    resources = await fetchedResources.data.resources;
    users = await fetchedUsers.data.users;
    comments = await fetchedComments.data.users;
    chartData = await fetchedData.data;
  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      resources,
      users,
      comments,
      chartData,
    },
  };
}
