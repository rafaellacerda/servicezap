import React, { useState, useEffect, useContext, useRef } from "react";

import * as XLSX from "xlsx";
import * as Yup from "yup";

import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import { FormControl, Grid, IconButton } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment";
import { AuthContext } from "../../context/Auth/AuthContext";
import { isArray, capitalize } from "lodash";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import AttachFile from "@material-ui/icons/AttachFile";
import { head } from "lodash";
import ConfirmationModal from "../ConfirmationModal";
import MessageVariablesPicker from "../MessageVariablesPicker";

import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  multFieldLine: {
    display: "flex",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },

  btnWrapper: {
    position: "relative",
  },

  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const ScheduleSchema = Yup.object().shape({
  body: Yup.string().min(5, "Mensagem muito curta").required("Obrigatório"),
  contactId: Yup.number().required("Obrigatório"),
  sendAt: Yup.string().required("Obrigatório"),
});

const ScheduleXlsModal = ({
  open,
  onClose,
  scheduleId,
  contactId,
  cleanContact,
  reload,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  console.log("user.queues", user);

  const initialState = {
    body: "",
    contactId: "",
    sendAt: moment().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
    sentAt: "",
  };

  const initialContact = {
    id: "",
    name: "",
  };

  const [schedule, setSchedule] = useState(initialState);
  const [currentContact, setCurrentContact] = useState(initialContact);
  const [contacts, setContacts] = useState([initialContact]);
  const [attachment, setAttachment] = useState(null);
  const attachmentFile = useRef(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const messageInputRef = useRef();

  const [data, setData] = React.useState(null);
  const dateFns = new DateFnsUtils({ locale: "pt-BR" });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, {
        type: "binary",
        cellDates: true,
      });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const xlsData = XLSX.utils.sheet_to_json(sheet);

      // xlsData.forEach((item) => {
      //   const { data, hora } = item;
      //   // const tempo = hora.split(":");

      //   // item.dataHora = dateFns.date(
      //   //   new Date(`
      //   //   ${data.substring(6, 10)}/
      //   //   ${data.substring(3, 5)}/
      //   //   ${data.substring(0, 2)} ${hora}`)
      //   // );
      // });

      setData(xlsData);
    };

    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    if (contactId && contacts.length) {
      const contact = contacts.find((c) => c.id === contactId);
      if (contact) {
        setCurrentContact(contact);
      }
    }
  }, [contactId, contacts]);

  useEffect(() => {
    const { companyId } = user;
    if (open) {
      try {
        (async () => {
          const { data: contactList } = await api.get("/contacts/list", {
            params: { companyId: companyId },
          });
          let customList = contactList.map((c) => ({ id: c.id, name: c.name }));
          if (isArray(customList)) {
            setContacts([{ id: "", name: "" }, ...customList]);
          }
          if (contactId) {
            setSchedule((prevState) => {
              return { ...prevState, contactId };
            });
          }

          if (!scheduleId) return;

          const { data } = await api.get(`/schedules/${scheduleId}`);
          setSchedule((prevState) => {
            return {
              ...prevState,
              ...data,
              sendAt: moment(data.sendAt).format("YYYY-MM-DDTHH:mm"),
            };
          });
          setCurrentContact(data.contact);
        })();
      } catch (err) {
        toastError(err);
      }
    }
  }, [scheduleId, contactId, open, user]);

  const handleClose = () => {
    onClose();
    setAttachment(null);
    setSchedule(initialState);
  };

  const handleAttachmentFile = (e) => {
    const file = head(e.target.files);
    if (file) {
      setAttachment(file);
    }
  };

  const handleSaveSchedule = async (values) => {
    const { companyId } = user;

    const list = data;

    list.forEach((item, index) => {
      item.sendAt = moment(values.sendAt).add(index, "minutes").format("YYYY-MM-DDTHH:mm");
    });

    const scheduleData = {
      body: "Cadastro via planilha",
      userId: user.id,
      companyId,
      listSchedule: list,
      sendAt: moment().format("YYYY-MM-DDTHH:mm"),
    };

    try {
      const { data } = await api.post("/schedules", scheduleData);

      toast.success(i18n.t("scheduleModal.success"));
      if (typeof reload == "function") {
        reload();
      }
      if (contactId) {
        if (typeof cleanContact === "function") {
          cleanContact();
          history.push("/schedules");
        }
      }
    } catch (err) {
      toastError(err);
    }

    setSchedule(initialState);
    handleClose();
  };

  const handleClickMsgVar = async (msgVar, setValueFunc) => {
    const el = messageInputRef.current;
    const firstHalfText = el.value.substring(0, el.selectionStart);
    const secondHalfText = el.value.substring(el.selectionEnd);
    const newCursorPos = el.selectionStart + msgVar.length;

    setValueFunc("body", `${firstHalfText}${msgVar}${secondHalfText}`);

    await new Promise((r) => setTimeout(r, 100));
    messageInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
  };

  const deleteMedia = async () => {
    if (attachment) {
      setAttachment(null);
      attachmentFile.current.value = null;
    }

    if (schedule.mediaPath) {
      await api.delete(`/schedules/${schedule.id}/media-upload`);
      setSchedule((prev) => ({
        ...prev,
        mediaPath: null,
      }));
      toast.success(i18n.t("scheduleModal.toasts.deleted"));
      if (typeof reload == "function") {
        console.log(reload);
        console.log("1");
        reload();
      }
    }
  };

  return (
    <div className={classes.root}>
      <ConfirmationModal
        title={i18n.t("scheduleModal.confirmationModal.deleteTitle")}
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={deleteMedia}
      >
        {i18n.t("scheduleModal.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">
          {schedule.status === "ERRO"
            ? "Erro de Envio"
            : `Mensagem ${capitalize(schedule.status)}`}
        </DialogTitle>
        <div style={{ display: "none" }}>
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            ref={attachmentFile}
            onChange={(e) => handleAttachmentFile(e)}
          />
        </div>
        <Formik
          initialValues={schedule}
          enableReinitialize={true}
          validationSchema={ScheduleSchema}
        // onSubmit={(values, actions) => {
        //   console.log('values', values)
        //   handleSaveSchedule(values);
        //   actions.setSubmitting(false);
        // }}
        >
          {({ touched, errors, isSubmitting, values, setFieldValue }) => (
            <Form>

              <DialogContent dividers>
                <Field
                  as={TextField}
                  label={i18n.t("scheduleModal.form.sendAt")}
                  type="datetime-local"
                  name="sendAt"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={touched.sendAt && Boolean(errors.sendAt)}
                  helperText={touched.sendAt && errors.sendAt}
                  variant="outlined"
                  fullWidth
                />

                <input
                  type="file"
                  style={{ marginTop: 5 }}
                  onChange={(e) => handleFileUpload(e)}
                  accept=".xls, .xlsx"
                />
                {(schedule.mediaPath || attachment) && (
                  <Grid xs={12} item>
                    <Button startIcon={<AttachFile />}>
                      {attachment ? attachment.name : schedule.mediaName}
                    </Button>
                    <IconButton
                      onClick={() => setConfirmationOpen(true)}
                      color="secondary"
                    >
                      <DeleteOutline color="secondary" />
                    </IconButton>
                  </Grid>
                )}
              </DialogContent>

              <DialogActions>
                {/* {!attachment && !schedule.mediaPath && (
                  <Button
                    color="primary"
                    onClick={() => attachmentFile.current.click()}
                    disabled={isSubmitting}
                    variant="outlined"
                  >
                    {i18n.t("quickMessages.buttons.attach")}
                  </Button>
                )} */}
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("scheduleModal.buttons.cancel")}
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  // type="submit"
                  className={classes.btnWrapper}
                  onClick={() => handleSaveSchedule(values)}
                >
                  {scheduleId
                    ? `${i18n.t("scheduleModal.buttons.okEdit")}`
                    : `${i18n.t("scheduleModal.buttons.okAdd")}`}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default ScheduleXlsModal;
