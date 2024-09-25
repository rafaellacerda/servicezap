import React from "react";

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Skeleton from "@material-ui/lab/Skeleton";

import { makeStyles } from "@material-ui/core/styles";
import { green, red } from "@material-ui/core/colors";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import moment from "moment";

import Rating from "@material-ui/lab/Rating";

import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

const StyledBadge = styled(Badge)(({ active }) => ({
  position: "relative",
  "& .MuiBadge-badge": {
    backgroundColor: active ? "#44b700" : "red",
    color: active ? "#44b700" : "red",
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const useStyles = makeStyles((theme) => ({
  on: {
    color: green[600],
    fontSize: "20px",
  },
  off: {
    color: red[600],
    fontSize: "20px",
  },
  pointer: {
    cursor: "pointer",
  },
  title: {
    color: theme.palette.textPrimary,
    marginTop: 10,
    marginBottom: 0,
    textAlign: "center",
  },
  main: {
    backgroundColor: theme.palette.light.main,
    width: "90%",
    minHeight: "345px",
  },
  user: {
    color: theme.palette.textPrimary,
    display: "inline-flex",
    alignItems: "center",
    flexDirection: "column",
    marginRight: 30,
    textAlign: "center",
  },
}));

export function RatingBox({ rating }) {
  const ratingTrunc = rating === null ? 0 : Math.trunc(rating);
  return <Rating defaultValue={ratingTrunc} max={3} readOnly />;
}

export default function TableAttendantsStatus(props) {
  const { loading, attendants } = props;
  const classes = useStyles();

  // function renderList() {
  //   return attendants.map((a, k) => (
  //     <TableRow key={k}>
  //       <TableCell style={{ border: "none" }}>{a.name}</TableCell>
  //       <TableCell align="center" style={{ border: "none" }}>
  //         {a.online ? (
  //           <CheckCircleIcon className={classes.on} />
  //         ) : (
  //           <ErrorIcon className={classes.off} />
  //         )}
  //       </TableCell>
  //     </TableRow>
  //   ));
  // }

  // function formatTime(minutes) {
  //   return moment()
  //     .startOf("day")
  //     .add(minutes, "minutes")
  //     .format("HH[h] mm[m]");
  // }

  return !loading ? (
    <div style={{}}>
      {attendants.map((a, k) => (
        <section className={classes.user}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            active={a.online}
          >
            <Avatar>{a.name[0]}</Avatar>
          </StyledBadge>
          {a.name}
        </section>
      ))}
    </div>
  ) : (
    // <TableContainer component={Paper} className={classes.main}>
    //   <h2 className={classes.title}>Atendentes</h2>
    //   <Table>
    //     <TableHead>
    //       <TableRow>
    //         <TableCell>Nome</TableCell>
    //         {/* <TableCell align="center">Avaliações</TableCell>
    //         <TableCell align="center">T.M. de Atendimento</TableCell> */}
    //         <TableCell align="center">Online</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       <StyledBadge
    //         overlap="circular"
    //         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    //         variant="dot"
    //         active={true}
    //       >
    //         <Avatar>R</Avatar>
    //       </StyledBadge>
    //       {/* {renderList()} */}
    //       {/* <TableRow>
    //                     <TableCell>Nome 4</TableCell>
    //                     <TableCell align="center">10</TableCell>
    //                     <TableCell align="center">10 minutos</TableCell>
    //                     <TableCell align="center">
    //                         <CheckCircleIcon className={classes.off} />
    //                     </TableCell>
    //                 </TableRow>
    //                 <TableRow>
    //                     <TableCell>Nome 5</TableCell>
    //                     <TableCell align="center">10</TableCell>
    //                     <TableCell align="center">10 minutos</TableCell>
    //                     <TableCell align="center">
    //                         <CheckCircleIcon className={classes.on} />
    //                     </TableCell>
    //                 </TableRow> */}
    //     </TableBody>
    //   </Table>
    // </TableContainer>
    <Skeleton variant="rect" height={150} />
  );
}
