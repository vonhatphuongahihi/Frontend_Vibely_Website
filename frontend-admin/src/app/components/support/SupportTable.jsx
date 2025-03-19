import { FaReply, FaTrash } from 'react-icons/fa';

const DocumentTable = ({ inquiries, openModal, setSelectedInquiry }) => {

  return (
    <table className="w-full border border-gray-400 border-collapse mt-4 bg-white">
      <thead>
        <tr className="border border-gray-400 text-left">
          <th className="px-2 py-3">Tên người dùng</th>
          <th className="px-2 py-3">Email</th>
          <th className="px-2 py-3">Nội dung thắc mắc</th>
          <th className="px-2 py-3">Ngày gửi</th>
          <th className="px-2 py-3">Trạng thái</th>
          <th className="px-2 py-3 text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {inquiries.map((inq, index) => (
          <tr key={index} className="border-t border-gray-300 text-left">
            <td className="px-2 py-3">{inq.username}</td>
            <td className="px-2 py-3">{inq.email}</td>
            <td className="px-2 py-3">{inq.message}</td>
            <td className="px-2 py-3">{inq.createdAt}</td>
            <td className="px-2 py-3">{inq.status}</td>
            <td className="px-2 py-3 text-center">
              {inq.status === 'Chưa phản hồi' && (
                <button 
                  className="text-white mr-2 bg-[#086280] p-[6px] rounded-sm cursor-pointer hover:bg-[#07556F]"
                  onClick={() => {
                    openModal('responseInquiry')
                    setSelectedInquiry(inq)}
                  }
                >
                  <FaReply />
                </button>
              )}
              <button 
                className="text-white bg-red-500 p-[6px] rounded-sm cursor-pointer hover:bg-red-600"
                onClick={() => openModal('deleteInquiry')}
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