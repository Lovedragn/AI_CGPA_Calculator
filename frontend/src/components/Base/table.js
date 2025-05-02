import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Tableform({ result }) {
  return (
    <Table className="bg-gradient-to-tr from-black to-zinc-800">
      <TableHeader className="bg-zinc-800">
        <TableRow>
          <TableHead className="pl-5 w-30">Code</TableHead>
          <TableHead className="px-5">Grade</TableHead>
          <TableHead className="pr-5 w-30 text-right">Credits</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className=" text-zinc-600 text-center">
        {result?.courses.map((course, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium text-left pl-5">
              {course["Course Code"]}
            </TableCell>
            <TableCell>{course.Grade}</TableCell>
            <TableCell className="text-right pr-7">{course.Credits}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default Tableform;
