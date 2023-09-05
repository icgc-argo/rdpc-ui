import { orderBy, uniq } from "lodash";

export const sleep = (time: number = 2000) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });

export const exportToTsv = <Data extends { [k: string]: string | number }>(
  data: Array<Data>,
  options: {
    exclude?: Array<keyof Data>;
    include?: Array<keyof Data>;
    order?: Array<keyof Data>;
    fileName?: string;
    headerDisplays?: { [k in keyof Data]?: string };
  } = {},
): void => {
  const allKeys = uniq(
    data.reduce(
      (acc, entry) => [...acc, ...Object.keys(entry)],
      [] as string[],
    ),
  );

  const {
    exclude: excludeKeys = [],
    include: includeKeys = allKeys,
    order = allKeys,
    fileName = "data.tsv",
    headerDisplays = allKeys.reduce<(typeof options)["headerDisplays"]>(
      (acc: any, key: string | number) => ({
        ...acc,
        [key]: options.headerDisplays ? options.headerDisplays[key] : key,
      }),
      {},
    ),
  } = options;
  const orderedKeys = orderBy(allKeys, (key) => order.indexOf(key));

  /**
   * construct the tsv data
   */

  const filteredKeys = orderedKeys
    .filter((key) => !excludeKeys.includes(key))
    .filter((key) => includeKeys.includes(key));

  const dataRows: string[][] = data.map((entry) =>
    filteredKeys.map((key) => String(entry[key])),
  );
  const headerRow = filteredKeys.map((key) => headerDisplays[key]);
  const tsvString = [headerRow, ...dataRows]
    .map((row) => row.join("\t"))
    .join("\n");

  /**
   * export data to tsv
   */
  const fileContent = `data:text/tsv;charset=utf-8,${encodeURI(tsvString)
    .split("#")
    .join("%23")}`; // needs to do this after as encodeURI doesn't handle # properly
  const link = document.createElement("a");
  link.setAttribute("href", fileContent);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
