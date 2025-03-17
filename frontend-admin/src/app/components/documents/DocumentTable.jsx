import { FaRegEdit, FaTrash } from 'react-icons/fa';

const DocumentTable = ({ documents, openModal, setSelectedDoc }) => {

  return (
    <table className="w-full border border-gray-400 border-collapse mt-4 bg-white">
      <thead>
        <tr className="border border-gray-400 text-left">
          <th className="px-2 py-3">Tiêu đề</th>
          <th className="px-2 py-3">Cấp học</th>
          <th className="px-2 py-3">Môn học</th>
          <th className="px-2 py-3">Số trang</th>
          <th className="px-2 py-3">Ngày đăng tải</th>
          <th className="px-2 py-3">Ngày cập nhật</th>
          <th className="px-2 py-3 text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((doc, index) => (
          <tr key={index} className="border-t border-gray-300 text-left">
            <td className="px-2 py-3">{doc.title}</td>
            <td className="px-2 py-3">{doc.level}</td>
            <td className="px-2 py-3">{doc.subject}</td>
            <td className="px-2 py-3">{doc.pages}</td>
            <td className="px-2 py-3">{doc.uploadDate}</td>
            <td className="px-2 py-3">{doc.updateDate}</td>
            <td className="px-2 py-3 text-center">
              <button 
                className="text-white mr-2 bg-[#086280] p-[6px] rounded-sm cursor-pointer hover:bg-[#07556F]"
                onClick={() => {
                  openModal('updateDocument')
                  setSelectedDoc(doc)}
                }
              >
                <FaRegEdit />
              </button>
              <button 
                className="text-white bg-red-500 p-[6px] rounded-sm cursor-pointer hover:bg-red-600"
                onClick={() => {
                  openModal('deleteDocument')
                  setSelectedDoc(doc)}
                }
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DocumentTable;