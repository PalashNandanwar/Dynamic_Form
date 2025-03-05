import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, Table, TableRow, TableCell } from "docx";
import { saveAs } from "file-saver";

const Response = () => {
    const { id } = useParams();
    const [responseData, setResponseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setError("Invalid ID provided.");
            setLoading(false);
            return;
        }

        const fetchDataById = async () => {
            try {
                const response = await fetch(`http://localhost:5000/responses`);
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: Unable to fetch data.`);
                }

                const result = await response.json();
                if (!Array.isArray(result)) {
                    throw new Error("Invalid data format.");
                }

                const matchedResponse = result.find(item => item.id === id);

                if (!matchedResponse) {
                    throw new Error("No one has filled this form yet.");
                }

                setResponseData(matchedResponse);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDataById();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-300 text-center mt-[2rem] text-2xl font-extrabold">{error}</p>;

    if (!responseData || !responseData.responses || responseData.responses.length === 0) {
        return <p className="text-gray-500 text-center">No responses available.</p>;
    }

    // Extract column headers from the first response
    const columnHeaders = responseData.responses[0]?.responses.map(entry => entry.label) || [];

    // 📌 Export to PDF
    const downloadPDF = () => {
        const doc = new jsPDF();

        doc.text(responseData.title, 10, 10);

        const columnHeaders = responseData.responses[0]?.responses.map(entry => entry.label) || [];
        const tableData = responseData.responses.map(responseItem =>
            responseItem.responses.map(entry => entry.input)
        );

        doc.autoTable({
            head: [columnHeaders],
            body: tableData,
        });

        const fileName = `responses_${id}.pdf`;
        doc.save(fileName);
    };

    // 📌 Export to Excel
    const downloadExcel = () => {
        const tableRows = responseData.responses.map(responseItem =>
            Object.fromEntries(responseItem.responses.map(entry => [entry.label, entry.input]))
        );

        const worksheet = XLSX.utils.json_to_sheet(tableRows, { header: columnHeaders });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

        XLSX.writeFile(workbook, `responses_${id}.xlsx`);
    };

    // 📌 Export to Word
    const downloadWord = () => {
        const table = new Table({
            rows: [
                new TableRow({
                    children: columnHeaders.map(header => new TableCell({ children: [new Paragraph(header)] }))
                }),
                ...responseData.responses.map(responseItem =>
                    new TableRow({
                        children: responseItem.responses.map(entry =>
                            new TableCell({ children: [new Paragraph(entry.input)] })
                        )
                    })
                )
            ]
        });

        const doc = new Document({
            sections: [{ children: [new Paragraph(responseData.title), table] }]
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, `responses_${id}.docx`);
        });
    };

    // 📌 Export to Text
    const downloadText = () => {
        let textContent = responseData.title + "\n\n";
        textContent += columnHeaders.join("\t") + "\n";
        responseData.responses.forEach(responseItem => {
            textContent += responseItem.responses.map(entry => entry.input).join("\t") + "\n";
        });

        const blob = new Blob([textContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `responses_${id}.txt`;
        link.click();
    };
    // json-server --watch db.json --port 5000
    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-800">{responseData.title}</h2>
            <p className="text-gray-600">{responseData.description}</p>

            {/* Table Display */}
            <div className="mt-4 overflow-x-auto">
                <h3 className="font-semibold">Responses:</h3>

                <table className="w-full border-collapse border border-gray-300 bg-white">
                    <thead>
                        <tr className="bg-gray-200">
                            {columnHeaders.map((header, index) => (
                                <th key={index} className="border border-gray-300 px-4 py-2 text-left">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {responseData.responses.map((responseItem, rowIndex) => (
                            <tr key={rowIndex} className="border border-gray-300">
                                {responseItem.responses.map((entry, colIndex) => (
                                    <td key={colIndex} className="border border-gray-300 px-4 py-2">
                                        {entry.input}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Download Buttons */}
            <div className="flex space-x-4 mt-4">
                <button onClick={downloadPDF} className="px-4 py-2 bg-red-500 text-white rounded">
                    Download PDF
                </button>
                <button onClick={downloadExcel} className="px-4 py-2 bg-green-500 text-white rounded">
                    Download Excel
                </button>
                <button onClick={downloadWord} className="px-4 py-2 bg-blue-500 text-white rounded">
                    Download Word
                </button>
                <button onClick={downloadText} className="px-4 py-2 bg-gray-500 text-white rounded">
                    Download Text
                </button>
            </div>
        </div>
    );
};

export default Response;
