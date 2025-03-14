import React from "react";
import Heading from "@/app/components/contact/Heading";
import Image from "next/image";
import Line from "@/app/components/about/LineInAbout"
import ScrollRevealEffect from '@/app/components/about/ScrollRevealEff';
import ProfileCard from '@/app/components/about/ProfileCard';
import data from './datasource.json';

const { WHY_CHOOSE, ABOUT, TEAM } = data;

const About = () => {
    return (
        <div className="container mx-auto px-4">
            <ScrollRevealEffect />

            {/* banner */}
            <div className="my-10 mt-20">
                <Heading title="Về chúng tôi" />
            </div>
            <div className="flex items-center justify-between mb-10">
                <div className="w-1/ ml-20 pr-10 flex items-center justify-end">
                    <Image
                        src={WHY_CHOOSE.picture}
                        width={550}
                        height={400}
                        className="filter contrast-125 saturate-150 brightness-75"
                    />
                </div>

                <div className="w-1/2 pr-28 pl-10">
                    <p className="text-2xl font-bold my-3">
                        {WHY_CHOOSE.title}
                    </p>
                    <p className="text-base text-gray-400">{WHY_CHOOSE.desc}</p>
                    <ul>
                        {WHY_CHOOSE.reason.map((row, key) => (
                            <li
                                key={key}
                                className="my-4 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg rounded-lg p-4 overflow-hidden"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="pl-5">
                                        <Image
                                            src={row.img}
                                            height={30}
                                            width={30}
                                            alt = ''
                                        />
                                    </div>

                                    <span className="text-xl font-medium">
                                        {row.label}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* about us */}
            <div className="flex items-start justify-center px-4 mx-20">
                <div className="flex-1 mx-5">
                    <div className="px-5 mb-16 left-element">
                        <p className="text-2xl font-bold py-5">
                            {ABOUT.text[0].title}
                        </p>
                        <p className="pl-3 leading-6 text-base">
                            {ABOUT.text[0].desc}
                        </p>
                    </div>

                    <div className="px-5 my-16 left-element">
                        <Image
                            src={ABOUT.img[1]}
                            width={400}
                            height={200}
                            className="rounded-xl"
                        />
                    </div>

                    <div className="px-5 left-element">
                        <p className="text-2xl font-bold py-5">
                            {ABOUT.text[2].title}
                        </p>
                        <p className="pl-3 leading-6 text-base">
                            {ABOUT.text[2].desc}
                        </p>
                    </div>
                </div>

                <Line />

                <div className="flex-1 ml-20">
                    <div className="px-10 mb-8 right-element">
                        <Image
                            src={ABOUT.img[0]}
                            height={200}
                            width={400}
                            className="rounded-xl"
                        />
                    </div>

                    <div className="px-10 my-16 right-element text-right">
                        <p className="text-2xl font-bold py-5">
                            {ABOUT.text[1].title}
                        </p>
                        <p className="pr-3 text-base">{ABOUT.text[1].desc}</p>
                    </div>

                    <div className="px-10 mt-16 right-element">
                        <Image
                            src={ABOUT.img[2]}
                            height={200}
                            width={400}
                            className="rounded-xl"
                        />
                    </div>
                </div>
            </div>
            
            {/* Team  */}
            <div className="my-10">
                <Heading title="Team & Founder" />
            </div>
            
            <div className="container mx-auto mt-24 mb-10">
                <div className="grid grid-cols-4">
                    {TEAM.map((row, key) => (
                        <div key={key} className="flex items-center justify-center">
                            <ProfileCard
                                img={row.img}
                                name={row.name}
                                role={row.role}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default About;