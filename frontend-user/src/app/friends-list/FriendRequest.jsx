import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { UserMinus, UserPlus } from "lucide-react";

const FriendRequest = ({ friend, onAction }) => {
  // Tạo chữ viết tắt từ username
  const userPlaceholder = friend?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white mb-4 p-4 shadow rounded-lg border border-gray-200"
      >
        <Avatar className="h-32 w-32 rounded mx-auto mb-4">
          {friend?.profilePicture ? (
            <AvatarImage src={friend?.profilePicture} alt={friend?.username} />
          ) : (
            <AvatarFallback className="bg-gray-200">
              {userPlaceholder}
            </AvatarFallback>
          )}
        </Avatar>
        <h3 className="text-lg font-semibold text-center mb-4 ">
          {friend?.username}
        </h3>

        <div className="flex flex-col justify-between">
          <Button
            className="bg-blue-500 text-white"
            size="lg"
            onClick={() => onAction("confirm", friend?.id)}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Xác nhận
          </Button>
          <Button className="bg-gray-200 mt-2" size="lg" onClick={() => onAction("delete", friend?.id)}>
            <UserMinus className="mr-2 h-4 w-4" /> Xóa
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FriendRequest;
