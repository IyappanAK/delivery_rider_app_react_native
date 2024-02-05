export const getTotalPrintWidth = (step = 0, jobWidth = 0) =>
  Number(jobWidth) * Number(step) + 15

export const getPouchWeight = ({
  gsm = 0,
  job_width = 0,
  repeat = 0,
  job_height = 0,
}: {
  gsm: number
  job_width: number
  repeat: number
  job_height: number
}) =>
  (
    Number(gsm) *
    (Number(job_width) / 1000) *
    ((Number(repeat) * Number(job_height)) / 1000)
  ).toFixed(3)

export const getGSM = (micron = 0, density = 0) =>
  Number((Number(micron) * Number(density)).toFixed(2))
