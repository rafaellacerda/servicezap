import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";

import SpeedIcon from "@material-ui/icons/Speed";
import GroupIcon from "@material-ui/icons/Group";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PersonIcon from "@material-ui/icons/Person";
import CallIcon from "@material-ui/icons/Call";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ForumIcon from "@material-ui/icons/Forum";
import FilterListIcon from "@material-ui/icons/FilterList";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import MessageIcon from "@material-ui/icons/Message";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import TimerIcon from "@material-ui/icons/Timer";

import background from "../../assets/background.png";
import background1 from "../../assets/atendimento.png";
import background2 from "../../assets/aguardando.png";
import background3 from "../../assets/finalizado.png";
import background4 from "../../assets/tempoconversa.png";
import background5 from "../../assets/emespera.png";

import { makeStyles } from "@material-ui/core/styles";
import { grey, blue } from "@material-ui/core/colors";
import { toast } from "react-toastify";

import Chart from "./Chart";
import ButtonWithSpinner from "../../components/ButtonWithSpinner";

import CardCounter from "../../components/Dashboard/CardCounter";
import TableAttendantsStatus from "../../components/Dashboard/TableAttendantsStatus";
import { isArray } from "lodash";

import { AuthContext } from "../../context/Auth/AuthContext";

import useDashboard from "../../hooks/useDashboard";
import useTickets from "../../hooks/useTickets";
import useUsers from "../../hooks/useUsers";
import useContacts from "../../hooks/useContacts";
import useMessages from "../../hooks/useMessages";
import { ChatsUser } from "./ChartsUser";

import Filters from "./Filters";
import { isEmpty } from "lodash";
import moment from "moment";
import { ChartsDate } from "./ChartsDate";

const useStyles = makeStyles((theme) => ({
  h1: {
    fontSize: "2rem",
    color: theme.palette.primary.main,
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.padding,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    height: 240,
    overflowY: "auto",
    ...theme.scrollbarStyles,
  },
  cardAvatar: {
    fontSize: "55px",
    color: grey[500],
    backgroundColor: "#ffffff",
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "bolder",
    textTransform: "uppercase",
    zIndex: 999999,
    position: "relative",
  },
  cardSubtitle: {
    color: grey[600],
    fontSize: "14px",
  },
  alignRight: {
    textAlign: "right",
  },
  fullWidth: {
    width: "100%",
  },
  selectContainer: {
    width: "100%",
    textAlign: "left",
  },
  iframeDashboard: {
    width: "100%",
    height: "calc(100vh - 64px)",
    border: "none",
  },
  container: {
    paddingTop: 10,
    paddingBottom: theme.spacing(4),

    display: "flex",
    maxWidth: "100%",
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 240,
  },
  customFixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 120,
  },
  customFixedHeightPaperLg: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
  },
  card1: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "160px",
    //bacakgroundColor: "palette",
    //backgroundColor: theme.palette.primary.main,
    // bckgroundColor:
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main,
    color: "#eee",
    borderRadius: 15,
    justifyContent: "center",
    position: "relative",

    // --bg: hsl(330 80% calc(90% - (var(--hover) * 10%)));
    // --accent: hsl(280 80% 40%);
    transition: "background 0.2s",
    // background: `radial-gradient(circle at top left, ${
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main
    // }, transparent 75%), #211d15`,
    background:
      "radial-gradient(circle at top left, #746033, transparent 75%), #a88a46",
  },
  card2: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "160px",
    //backgroundColor: "palette",
    //backgroundColor: theme.palette.primary.main,
    // backgroundColor:
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main,
    color: "#eee",
    borderRadius: 15,
    justifyContent: "center",
    position: "relative",

    transition: "background 0.2s",
    // background: `radial-gradient(circle at top left, ${
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main
    // }, transparent 75%), #211d15`,
    background:
      "radial-gradient(circle at top left, #746033, transparent 75%), #a88a46",
  },
  card3: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "160px",
    //backgroundColor: theme.palette.primary.main,
    // backgroundColor:
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main,
    color: "#eee",
    borderRadius: 15,
    justifyContent: "center",
    position: "relative",

    transition: "background 0.2s",
    // background: `radial-gradient(circle at top left, ${
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main
    // }, transparent 75%), #211d15`,
    background:
      "radial-gradient(circle at top left, #746033, transparent 75%), #a88a46",
  },
  card4: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "160px",
    //backgroundColor: theme.palette.primary.main,
    // backgroundColor:
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main,
    color: "#eee",
    borderRadius: 15,
    justifyContent: "center",
    position: "relative",

    cursor: "pointer",
    // transition: "background 0.2s",
    // background: `radial-gradient(circle at top left, ${
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main
    // }, transparent 75%), #211d15`,
    background:
      "radial-gradient(circle at top left, #746033, transparent 75%), #a88a46",
  },
  card5: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "160px",
    //backgroundColor: theme.palette.primary.main,
    // backgroundColor:
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main,
    color: "#eee",
    borderRadius: 15,
    justifyContent: "center",
    position: "relative",

    transition: "background 0.2s",
    // background: `radial-gradient(circle at top left, ${
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main
    // }, transparent 75%), #211d15`,
    background:
      "radial-gradient(circle at top left, #746033, transparent 75%), #a88a46",
  },
  card6: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "160px",
    //backgroundColor: theme.palette.primary.main,
    // backgroundColor:
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main,
    color: "#eee",
    borderRadius: 15,
    justifyContent: "center",
    position: "relative",

    transition: "background 0.2s",
    // background: `radial-gradient(circle at top left, ${
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main
    // }, transparent 75%), #211d15`,
    background:
      "radial-gradient(circle at top left, #746033, transparent 75%), #a88a46",
  },
  card7: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "160px",
    //backgroundColor: theme.palette.primary.main,
    // backgroundColor:
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main,
    color: "#eee",
    borderRadius: 15,
    justifyContent: "center",
    position: "relative",

    transition: "background 0.2s",
    // background: `radial-gradient(circle at top left, ${
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main
    // }, transparent 75%), #211d15`,
    background:
      "radial-gradient(circle at top left, #746033, transparent 75%), #a88a46",
  },
  card8: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "160px",
    //backgroundColor: theme.palette.primary.main,
    // backgroundColor:
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main,
    color: "#eee",
    borderRadius: 15,
    justifyContent: "center",
    position: "relative",

    transition: "background 0.2s",
    // background: `radial-gradient(circle at top left, ${
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main
    // }, transparent 75%), #211d15`,
    background:
      "radial-gradient(circle at top left, #746033, transparent 75%), #a88a46",
  },
  card9: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "160px",
    //backgroundColor: theme.palette.primary.main,
    // backgroundColor:
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main,
    color: "#eee",
    borderRadius: 15,
    justifyContent: "center",
    position: "relative",

    transition: "background 0.2s",
    // background: `radial-gradient(circle at top left, ${
    //   theme.palette.type === "dark"
    //     ? theme.palette.boxticket
    //     : theme.palette.primary.main
    // }, transparent 75%), #211d15`,
    background:
      "radial-gradient(circle at top left, #746033, transparent 75%), #a88a46",
  },
  fixedHeightPaper2: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor: theme.palette.light.main,
  },
  backgroundCard: {
    position: "absolute",
    top: "-35px",
    right: "-123px",
    width: "265px",
    opacity: 0.2,
    transform: "rotateY(180deg)",
  },
  backgroundCardTop: {
    position: "absolute",
    top: "10px",
    right: "7px",
    width: "145px",
    opacity: 0.5,
    position: "absolute",
  },
  cardWidth: {
    maxWidth: 360,
    minWidth: 300,
  },
  cardWidth2: {
    maxWidth: 400,
    minWidth: 400,
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [counters, setCounters] = useState({});
  const [attendants, setAttendants] = useState([]);
  const [period, setPeriod] = useState(0);
  const [filterType, setFilterType] = useState(1);
  const [dateFrom, setDateFrom] = useState(
    moment("1", "D").format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const { find } = useDashboard();

  const [tasks, setTasks] = useState([]);

  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  let now = `${year}-${month < 10 ? `0${month}` : `${month}`}-${
    date < 10 ? `0${date}` : `${date}`
  }`;

  const [showFilter, setShowFilter] = useState(false);
  const [queueTicket, setQueueTicket] = useState(false);

  const { user } = useContext(AuthContext);
  const history = useHistory();

  var userQueueIds = [];

  if (user.queues && user.queues.length > 0) {
    userQueueIds = user.queues.map((q) => q.id);
  }

  useEffect(() => {
    async function firstLoad() {
      await fetchData();
    }
    setTimeout(() => {
      firstLoad();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // async function handleChangePeriod(value) {
  //   setPeriod(value);
  // }

  // async function handleChangeFilterType(value) {
  //   setFilterType(value);
  //   if (value === 1) {
  //     setPeriod(0);
  //   } else {
  //     setDateFrom("");
  //     setDateTo("");
  //   }
  // }

  async function fetchData() {
    setLoading(true);

    let params = {};

    if (period > 0) {
      params = {
        days: period,
      };
    }

    if (!isEmpty(dateFrom) && moment(dateFrom).isValid()) {
      params = {
        ...params,
        date_from: moment(dateFrom).format("YYYY-MM-DD"),
      };
    }

    if (!isEmpty(dateTo) && moment(dateTo).isValid()) {
      params = {
        ...params,
        date_to: moment(dateTo).format("YYYY-MM-DD"),
      };
    }

    if (Object.keys(params).length === 0) {
      toast.error("Parametrize o filtro");
      setLoading(false);
      return;
    }

    const data = await find(params);

    setCounters(data.counters);
    if (isArray(data.attendants)) {
      setAttendants(data.attendants);
    } else {
      setAttendants([]);
    }

    setLoading(false);
  }

  function formatTime(minutes) {
    return moment()
      .startOf("day")
      .add(minutes, "minutes")
      .format("HH[h] mm[m]");
  }

  // const GetUsers = () => {
  //   let count;
  //   let userOnline = 0;
  //   attendants.forEach((user) => {
  //     if (user.online === true) {
  //       userOnline = userOnline + 1;
  //     }
  //   });
  //   count = userOnline === 0 ? 0 : userOnline;
  //   return count;
  // };

  const GetContacts = (all) => {
    let props = {};
    if (all) {
      props = {};
    }
    const { count } = useContacts(props);
    return count;
  };

  // function renderFilters() {
  //   if (filterType === 1) {
  //     return (
  //       <>
  //         <Grid item xs={12} sm={6} md={4}>
  //           <TextField
  //             label="Data Inicial"
  //             type="date"
  //             value={dateFrom}
  //             onChange={(e) => setDateFrom(e.target.value)}
  //             className={classes.fullWidth}
  //             InputLabelProps={{
  //               shrink: true,
  //             }}
  //           />
  //         </Grid>
  //         <Grid item xs={12} sm={6} md={4}>
  //           <TextField
  //             label="Data Final"
  //             type="date"
  //             value={dateTo}
  //             onChange={(e) => setDateTo(e.target.value)}
  //             className={classes.fullWidth}
  //             InputLabelProps={{
  //               shrink: true,
  //             }}
  //           />
  //         </Grid>
  //       </>
  //     );
  //   } else {
  //     return (
  //       <Grid item xs={12} sm={6} md={4}>
  //         <FormControl className={classes.selectContainer}>
  //           <InputLabel id="period-selector-label">Período</InputLabel>
  //           <Select
  //             labelId="period-selector-label"
  //             id="period-selector"
  //             value={period}
  //             onChange={(e) => handleChangePeriod(e.target.value)}
  //           >
  //             <MenuItem value={0}>Nenhum selecionado</MenuItem>
  //             <MenuItem value={3}>Últimos 3 dias</MenuItem>
  //             <MenuItem value={7}>Últimos 7 dias</MenuItem>
  //             <MenuItem value={15}>Últimos 15 dias</MenuItem>
  //             <MenuItem value={30}>Últimos 30 dias</MenuItem>
  //             <MenuItem value={60}>Últimos 60 dias</MenuItem>
  //             <MenuItem value={90}>Últimos 90 dias</MenuItem>
  //           </Select>
  //           <FormHelperText>Selecione o período desejado</FormHelperText>
  //         </FormControl>
  //       </Grid>
  //     );
  //   }
  // }

  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ width: "70%" }}>
            {attendants.length ? (
              <>
                <h1 className={classes.h1}>Atendentes</h1>
                <TableAttendantsStatus
                  attendants={attendants}
                  loading={loading}
                />
              </>
            ) : null}
          </div>
          <div style={{ width: "10%", minWidth: 160, marginRight: 5 }}>
            <Paper
              className={classes.card4}
              style={{ overflow: "hidden" }}
              elevation={6}
              onClick={() => history.push("/contacts")}
            >
              <Grid item xs={8}>
                <img src={background} className={classes.backgroundCard} />
                <Typography
                  component="h3"
                  variant="h6"
                  paragraph
                  className={classes.cardTitle}
                >
                  Contatos
                </Typography>
                <Grid item>
                  <Typography component="h1" variant="h4">
                    {GetContacts(true)}
                  </Typography>
                </Grid>
              </Grid>
              {/* <Grid item xs={4}>
                  <GroupAddIcon
                    style={{
                      fontSize: 100,
                      color: "#FFFFFF",
                    }}
                  />
                </Grid> */}
            </Paper>
          </div>
          <div style={{ width: "10%", minWidth: 160 }}>
            <Paper
              className={classes.card4}
              style={{ overflow: "hidden" }}
              elevation={6}
              onClick={() => history.push("/tasks")}
            >
              <Grid item xs={8}>
                <img src={background} className={classes.backgroundCard} />
                <Typography
                  component="h3"
                  variant="h6"
                  paragraph
                  className={classes.cardTitle}
                >
                  Tarefas
                </Typography>
                <section
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    color: "#000",
                  }}
                >
                  {tasks.map((task, index) => (
                    <span>{task.text}</span>
                  ))}
                </section>
              </Grid>
              {/* <Grid item xs={4}>
                  <GroupAddIcon
                    style={{
                      fontSize: 100,
                      color: "#FFFFFF",
                    }}
                  />
                </Grid> */}
            </Paper>
          </div>
        </div>
      </Container>

      <Container maxWidth="lg" className={classes.container}>
        <section style={{ width: "100%" }}>
          <h1 className={classes.h1}>Desempenho do dia</h1>
          <Grid container spacing={3}>
            {/* EM ATENDIMENTO */}
            <Grid item xs={6} sm={4} className={classes.cardWidth}>
              <Paper
                className={classes.card1}
                style={{ overflow: "hidden" }}
                elevation={4}
              >
                <Grid container spacing={3}>
                  <Grid item xs={8}>
                    <img
                      src={background1}
                      className={classes.backgroundCardTop}
                    />
                    <Typography
                      component="h3"
                      variant="h6"
                      paragraph
                      className={classes.cardTitle}
                    >
                      Em atendimento
                    </Typography>
                    <Grid item>
                      <Typography component="h1" variant="h4">
                        {counters.supportHappening}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* <Grid item xs={2}>
                  <CallIcon
                    style={{
                      fontSize: 100,
                      color: "#FFFFFF",
                    }}
                  />
                </Grid> */}
                </Grid>
              </Paper>
            </Grid>

            {/* AGUARDANDO */}
            <Grid item xs={6} sm={4} className={classes.cardWidth}>
              <Paper
                className={classes.card2}
                style={{ overflow: "hidden" }}
                elevation={6}
              >
                <Grid container spacing={3}>
                  <Grid item xs={8}>
                    <img
                      src={background2}
                      className={classes.backgroundCardTop}
                    />
                    <Typography
                      component="h3"
                      variant="h6"
                      paragraph
                      className={classes.cardTitle}
                    >
                      Aguardando
                    </Typography>
                    <Grid item>
                      <Typography component="h1" variant="h4">
                        {counters.supportPending}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* <Grid item xs={4}>
                  <HourglassEmptyIcon
                    style={{
                      fontSize: 100,
                      color: "#FFFFFF",
                    }}
                  />
                </Grid> */}
                </Grid>
              </Paper>
            </Grid>

            {/* FINALIZADOS */}
            <Grid item xs={6} sm={4} className={classes.cardWidth}>
              <Paper
                className={classes.card3}
                style={{ overflow: "hidden" }}
                elevation={6}
              >
                <Grid container spacing={3}>
                  <Grid item xs={8}>
                    <img
                      src={background3}
                      className={classes.backgroundCardTop}
                    />
                    <Typography
                      component="h3"
                      variant="h6"
                      paragraph
                      className={classes.cardTitle}
                    >
                      Finalizados
                    </Typography>
                    <Grid item>
                      <Typography component="h1" variant="h4">
                        {counters.supportFinished}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* <Grid item xs={4}>
                  <CheckCircleIcon
                    style={{
                      fontSize: 100,
                      color: "#FFFFFF",
                    }}
                  />
                </Grid> */}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </section>
      </Container>

      <Container maxWidth="lg" className={classes.container}>
        <section style={{ width: "100%" }}>
          <h1 className={classes.h1}>Tempo em conversa no dia</h1>
          <Grid container spacing={3} justifyContent="flex-start">
            {/* T.M. DE ATENDIMENTO */}
            <Grid item xs={6} sm={3} className={classes.cardWidth2}>
              <Paper
                className={classes.card8}
                style={{ overflow: "hidden" }}
                elevation={6}
              >
                <Grid container spacing={3}>
                  <Grid item xs={8}>
                    <img
                      src={background4}
                      className={classes.backgroundCardTop}
                    />
                    <Typography
                      component="h3"
                      variant="h6"
                      paragraph
                      className={classes.cardTitle}
                    >
                      {/* T.M. de Conversa */}
                      Em Conversa
                    </Typography>
                    <Grid item style={{ width: 200 }}>
                      <Typography component="h1" variant="h4">
                        {formatTime(counters.avgSupportTime)}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* <Grid item xs={4}>
                  <AccessAlarmIcon
                    style={{
                      fontSize: 100,
                      color: "#FFFFFF",
                    }}
                  />
                </Grid> */}
                </Grid>
              </Paper>
            </Grid>
            {/* T.M. DE ESPERA */}
            <Grid item xs={6} sm={3} className={classes.cardWidth2}>
              <Paper
                className={classes.card9}
                style={{ overflow: "hidden" }}
                elevation={6}
              >
                <Grid container spacing={3}>
                  <Grid item xs={8}>
                    <img
                      src={background5}
                      className={classes.backgroundCardTop}
                    />
                    <Typography
                      component="h3"
                      variant="h6"
                      paragraph
                      className={classes.cardTitle}
                    >
                      {/* T.M. de Espera */}
                      Em Espera
                    </Typography>
                    <Grid item style={{ width: 200 }}>
                      <Typography component="h1" variant="h4">
                        {formatTime(counters.avgWaitTime)}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* <Grid item xs={4}>
                  <TimerIcon
                    style={{
                      fontSize: 100,
                      color: "#FFFFFF",
                    }}
                  />
                </Grid> */}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </section>
      </Container>

      <Container maxWidth="lg" className={classes.container}>
        <section style={{ width: "100%" }}>
          <h1 className={classes.h1}>Conversas por usuários</h1>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "45%" }}>
              <ChatsUser />
            </div>
            <div style={{ width: "45%" }}>
              <ChartsDate />
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default Dashboard;
