"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, Pencil, PenLine, Save, SquarePlus, X } from "lucide-react";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ProfileHeader = () => {
  const [isEditProfileModel, setIsEditProfileModel] = useState(false);
  const [isEditingField, setIsEditingField] = useState(null);
  const [profile, setProfile] = useState({
    job: "Làm việc tại CLB Sách Và Hành Động UIT",
    location: "Sống tại Khánh Hòa, Việt Nam",
    hometown: "Khánh Hòa",
    education: "Trường đại học Công nghệ Thông tin",
    birthday: "01/01/2000",
  });

  const handleEdit = (field) => {
    setIsEditingField(field);
  };

  const handleCancel = () => {
    setIsEditingField(null);
  };

  const handleSave = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setIsEditingField(null);
  };
  return (
    <div className="relative">
      <div className="relative h-64 md:h-80 bg-gray-300 overflow-hidden ">
        <img
          src="/images/BG.png"
          alt="cover"
          className="w-full h-full object-cover"
        />
      </div>
      {/* profile section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end md:space-x-5 ">
          <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-700">
            <AvatarImage src="/images/phuong.jpg" />
            <AvatarFallback className="dark:bg-gray-400">P</AvatarFallback>
          </Avatar>
          <div className="mt-4 mdLmt-0 text-center md:text-left flex-grow">
            <h1 className="text-3xl font-bold">Võ Nhất Phương</h1>
            <p className="text-gray-400 font-semibold">@phuong.vonhat.tuhy</p>
          </div>
          <div className="flex flex-col">
            <Button className="mt-4 md:mt-0 bg-[#086280] text-white cursor-pointer">
              <SquarePlus className="w-4 h-4 mr-2" />
              Thêm bài viết
            </Button>
            <Button
              className="mt-4 md:mt-1 font-semibold cursor-pointer"
              onClick={() => setIsEditProfileModel(true)}
            >
              <PenLine className="w-4 h-4 mr-2" />
              Chỉnh sửa trang cá nhân
            </Button>
          </div>
        </div>
      </div>
      {/* edit profile model */}
      <AnimatePresence>
        {isEditProfileModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className=" bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto hidden-scrollbar"
            >
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Chỉnh sửa trang cá nhân
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditProfileModel(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form
                className="space-y-4"
                // onSubmit={handleSubmit(onSubmitProfile)}
              >
                {/* Ảnh đại diện */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="imageProfile" className="font-bold">
                      Ảnh đại diện
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-[#086280] hover:text-gray-500"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-700">
                      <AvatarImage src="/images/phuong.jpg" />
                      <AvatarFallback className="dark:bg-gray-400">
                        P
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Ảnh bìa */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="imageCover" className="font-bold">
                      Ảnh bìa
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-[#086280] hover:text-gray-500"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex justify-center rounded-lg overflow-hidden">
                    <img
                      src="/images/BG.png"
                      alt="Ảnh bìa"
                      className="w-3/4 h-35 object-cover rounded-lg"
                    />
                  </div>
                </div>
                {/* Công việc */}
                <ProfileField
                  label="Công việc"
                  field="job"
                  value={profile.job}
                  isEditingField={isEditingField}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />

                {/* Tỉnh/Thành phố hiện tại */}
                <ProfileField
                  label="Tỉnh/Thành phố hiện tại"
                  field="location"
                  value={profile.location}
                  isEditingField={isEditingField}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />

                {/* Quê quán */}
                <ProfileField
                  label="Quê quán"
                  field="hometown"
                  value={profile.hometown}
                  isEditingField={isEditingField}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />

                {/* Học vấn */}
                <ProfileField
                  label="Học vấn"
                  field="education"
                  value={profile.education}
                  isEditingField={isEditingField}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />

                {/* Ngày sinh */}
                <ProfileField
                  label="Ngày sinh"
                  field="birthday"
                  value={profile.birthday}
                  isEditingField={isEditingField}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-400 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                  {/* {loading ? "Saving..." : "Save changes"} */}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Component cho từng trường hồ sơ */
const ProfileField = ({
  label,
  field,
  value,
  isEditingField,
  onEdit,
  onSave,
  onCancel,
}) => {
  const [inputValue, setInputValue] = useState(value);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <Label className="font-bold">{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`${
            isEditingField === field
              ? "text-gray-500"
              : "text-[#086280] hover:text-gray-500"
          }`}
          onClick={() => onEdit(field)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </div>

      {isEditingField === field ? (
        <div className="flex items-center space-x-2 border p-2 rounded-md">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border-none focus:ring-0"
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-red-500"
            onClick={onCancel}
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-green-500"
            onClick={() => onSave(field, inputValue)}
          >
            <Check className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <p className={`text-gray-700  ${!value && "italic text-gray-400"}`}>
          {value || `Chưa thêm ${label.toLowerCase()}`}
        </p>
      )}
    </div>
  );
};

export default ProfileHeader;
