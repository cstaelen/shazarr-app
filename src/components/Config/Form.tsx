import {
  Box,
  Input,
  Button,
  Paper,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useState, FormEvent } from "react";
import { useShazarrProvider } from "../Shazarr/Provider";
import ApiErrorAlert from "./Alert";
import styled from "@emotion/styled";
import { useConfigProvider } from "./Provider";

export default function ConfigForm() {
  const [showApiForm, setShowApiForm] = useState<boolean>();
  const { recordingStatus, recordingError } = useShazarrProvider();
  const {
    config,
    formConfig,
    isNetworkConnected,
    actions: { setConfig },
  } = useConfigProvider();

  if (!formConfig) return null;

  function saveConfig(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setConfig({
      ...config,
      lidarr_url: data.get("lidarr_url")?.toString() || "",
      lidarr_api_key: data.get("lidarr_api_key")?.toString() || "",
      lidarr_library_path: data.get("lidarr_library_path")?.toString() || "",
      tidarr_url: data.get("tidarr_url")?.toString() || "",
    });
    setShowApiForm(false)
  }

  return (
    <>
      {!isNetworkConnected && recordingStatus === "inactive" && (
        <ApiErrorAlert severity="info" />
      )}
      {recordingError && recordingStatus === "inactive" && (
        <ApiErrorAlert message={recordingError} />
      )}
      <Dialog
        fullWidth
        maxWidth="xs"
        open={!!showApiForm}
        onClose={() => setShowApiForm(false)}
      >
        <DialogContent sx={{ padding: "0.5rem" }}>
          <Box component="form" onSubmit={(e) => saveConfig(e)}>
            {Object.entries(formConfig)?.map((field, index) => (
              <Box marginBottom={2} key={`form-field-${index}`}>
                <Paper sx={{ padding: "0.5rem" }}>
                  <Input
                    name={field[0]}
                    type={field[1].type}
                    sx={{ fontSize: "0.925rem" }}
                    defaultValue={field[1].value}
                    placeholder={field[1].placeholder}
                    fullWidth
                  />
                </Paper>
              </Box>
            ))}
            <Box>
              <Button fullWidth type="submit" variant="contained">
                Save configuration
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <ButtonConfig>
        <Button
          onClick={() => setShowApiForm(!showApiForm)}
          disabled={recordingStatus !== "inactive"}
        >
          Server configuration
        </Button>
      </ButtonConfig>
    </>
  );
}

const ButtonConfig = styled.div`
  margin-bottom: 1rem;
`;
