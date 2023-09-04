import { ClinicalRegistrationData } from "@/__generated__/graphql";
import { get, union } from "lodash";
import FileTable from "./FileTable";

export type FileTableData = ClinicalRegistrationData & {
  row: number;
  isNew: boolean;
};

const recordsToFileTable = (
  records: ClinicalRegistrationData[],
  newRows: Array<number>,
): FileTableData[] =>
  records.map((record) => {
    const fields = get(record, "fields", []);
    const data = fields.reduce(
      // @ts-expect-error
      (acc, cur) => ({ ...acc, [cur.name]: cur.value }),
      {} as any,
    ); // @ts-expect-error

    return { ...data, row: record.row, isNew: newRows.includes(record.row) };
  });

const FilePreview = ({
  registration,
}: {
  registration: ClinicalRegistrationData;
}) => {
  const fileRecords = get(registration, "records", []);
  console.log("file records", fileRecords);

  const {
    createdAt = "",
    creator = "",
    fileName = "",
    alreadyRegistered: { count: alreadyRegisteredCount = 0 },
    newDonors: { rows: newDonors },
    newSamples: { rows: newSamples },
    newSpecimens: { rows: newSpecimens },
  } = registration;

  const submissionInfo = { createdAt, creator, fileName };
  const newRows = union(newDonors, newSamples, newSpecimens);
  const stats = {
    newCount: newRows.length,
    existingCount: alreadyRegisteredCount,
  };

  const records = recordsToFileTable(fileRecords, newRows);

  return (
    <FileTable
      records={records}
      stats={stats}
      submissionInfo={submissionInfo}
    />
  );
};

export default FilePreview;
