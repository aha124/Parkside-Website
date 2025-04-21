'use client';

import PageTransition from "@/components/ui/PageTransition";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import HeroSection from "@/components/ui/HeroSection";
import LeadershipProfile from "@/components/leadership/LeadershipProfile";

type ChorusAffiliation = 'harmony' | 'melody' | 'both';

interface LeadershipMember {
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  chorusAffiliation?: ChorusAffiliation;
}

const musicLeadership: LeadershipMember[] = [
  {
    name: "Sean Devine",
    title: "Artistic Director & Immediate Past President",
    bio: "Sean Devine brings over 30 years of experience in performance, design, and education to the barbershop community. He is a sought-after coach and clinician, a certified BHS Performance Judge, and a champion quartet singer with OC Times.\n\nBorn and raised right here in “The Sweetest Place on Earth,” Sean launched his professional career performing in the resident shows at Hersheypark, later accepting a full-time role touring with America’s Premier Doo-Wop Group, The Alley Cats. During his years in Southern California, he also served in music leadership with the Masters of Harmony, was a founding member of the Westminster Chorus, and joined the Dapper Dans as a Cast Member at Disneyland.\n\nIn addition to his musical pursuits, Sean serves as the Executive Director of the Association of International Champions (AIC)—a non-profit organization committed to preserving barbershop quartet singing through gold-medal performances, recordings, productions, educational programs, and financial support.",
    photoUrl: "/images/seandevine.jpg",
    chorusAffiliation: "both"
  } as const,
  {
    name: "Vince Sandroni",
    title: "Music Director",
    bio: "Vince began his musical career with 15 years in the Maryland State Boychoir, serving as a chorister, soloist, and conducting intern. He graduated from Towson University with a Bachelor's of Science in Music Education. During his time there he performed in multiple productions including a lead role in Die Fledermaus. Vince is the chorus teacher at Cockeysville Middle School in Baltimore County. He started singing barbershop in High School and has since participated in numerous conventions, Harmony Brigades, and the No Borders Youth Consort.\n\nA proud Parksider, Vince also sings tenor in the 2016 Barbershop Harmony Society Youth Quartet International Champions, Pratt Street Power!",
    photoUrl: "/images/vincesandroni.png",
    chorusAffiliation: "harmony"
  } as const,
  {
    name: "Melody Hine",
    title: "Director of Parkside Melody",
    bio: "Bio coming soon.",
    photoUrl: "/images/melodyhine.jpg",
    chorusAffiliation: "melody"
  } as const,
  {
    name: "Maddie Larrimore",
    title: "Director of Parkside Melody",
    bio: "Madeleine Larrimore is a dedicated educator and accomplished musician based in Baltimore, MD. She holds a Bachelor's degree in Vocal Music Education from Towson University (2017), where she was actively involved in various ensembles and productions. A key moment in her time at Towson was studying choral conducting with Dr. Arian Khaefi, during which her passion for barbershop music grew. This inspired her to attend both District and International Conventions.\n\nAs a high school chorus teacher, Maddie introduced barbershop singing into her curriculum, sending a mixed quartet of students to the Harmony College East barbershop camp in 2019. She later earned a Master's degree in Music Education from Longy School of Music at Bard College (2023), with a capstone project focused on incorporating barbershop harmony into high school choral classrooms. This project provides a curriculum for educators looking to introduce barbershop music into their teaching.\n\nIn the Spring of 2024, Maddie had the privilege of teaching Barbershop Pedagogy at Towson University as an adjunct faculty member. As a charter member of Parkside Melody, she is excited to witness the group's growth and loves co-directing alongside Melody Hine.",
    photoUrl: "/images/mlarrimore.jpg",
    chorusAffiliation: "melody"
  } as const
];

const boardMembers = [
  {
    id: "president",
    name: "Clay Monson",
    title: "President",
    bio: "Clay's musical journey began in church and high school all-state choruses and a cappella chamber ensembles. He joined the Barbershop Harmony Society (BHS) in 2015 as a bass singer with the Chorus of the Genesee, where he served as Programming Vice President. In 2017, Clay joined Harmonic Collective, serving as Vice President of Chapter Development and later as Chapter President. He became a certified BHS Performance Judge in 2023.\n\nClay joined Parkside Harmony in early 2023, quickly becoming an integral part of the organization. He serves as Performance Coordinator on the Music team and was a Board Member at Large in 2024 before becoming Chapter President.\n\nProfessionally, Clay taught middle and high school ELA for eight years before transitioning to the private sector in 2021 as a Literacy Specialist and consultant. He is now the Professional Learning Manager for the Northeast Region at a large educational publisher. Clay is also an active Performance and Stage Communication coach, working with Barbershop choruses, quartets, and other ensembles. He frequently judges Novice Quartet contests and volunteers for youth contest preliminary rounds for the BHS. He has served as faculty for BHS's Virtual Harmony University and will be part of Barbershop in Germany (BinG!)'s educational event in 2025.\n\nOutside of his professional and musical endeavors, Clay shares his passion for music and education as the Mid-Atlantic District's Vice President of Education. His dedication to fostering a supportive environment for Parkside Harmony members is evident in his leadership and commitment to the chorus's success.\n\nClay Monson is dedicated to the growth and success of both Parkside's world class ensembles and continually enhancing the musical and social experiences for all members. He invites you to connect with him and learn more about our vibrant community.",
    photoUrl: "/images/cmonson.jpg"
  },
  {
    id: "evp-marketing",
    name: "Anthony Arbaiza",
    title: "Executive Vice President of Marketing",
    bio: "Anthony Arbaiza brings a deep love for barbershop music and a wealth of experience in data analytics and strategic marketing to his role as Vice President of Marketing for Parkside Harmony. A dedicated member of the chorus, Anthony has found not only a creative outlet in singing but also a strong sense of brotherhood and community within Parkside.\n\nOriginally from New York City, Anthony's background is as diverse as his passions. He holds a degree in Acting from NYU's Tisch School of the Arts and later earned a Master's in Data Science from Penn State University, blending creativity with analytical expertise. His professional career as a Data and Analytics Manager is rooted in environmental monitoring and data-driven decision-making, but he has always found ways to merge his storytelling abilities with his technical acumen—skills that serve him well in leading Parkside's marketing efforts.\n\nBeyond his professional and musical pursuits, Anthony is an avid traveler and outdoor enthusiast. He has hiked and camped in breathtaking locations such as Yosemite National Park, Canada, and the deserts of Arizona, embracing the challenge and beauty of the natural world. His love for performance extends beyond music, as he remains actively involved in theater of all kinds, with a particular draw to musical productions.\n\nAs VP of Marketing, Anthony is committed to expanding Parkside Harmony's reach, celebrating its members, and ensuring that the joy of barbershop music continues to inspire audiences far and wide.",
    photoUrl: "/images/aarbaiza.png"
  },
  {
    id: "vp-membership",
    name: "Rick Crider",
    title: "Vice President of Membership",
    bio: "Rick Crider has had a lifelong passion for music. He enjoys playing the piano and is also in the process of learning the guitar, demonstrating his love for musical exploration and growth.\n\nRick has been a dedicated member of the Barbershop Harmony Society for 20 years. His journey with the society began with the Chorus of the Blue Juniata in Lewistown, PA, and continued with the Nittany Knights in State College, PA. These experiences have allowed him to engage deeply with the barbershop music community and further develop his musical skills.\n\nIn addition to his involvement with choruses, Rick also enjoys singing with his two quartets, Level Best and The Young and the Rest of Us. These groups provide him with additional opportunities to express his musical talents and collaborate with other passionate singers.\n\nRick is also committed to supporting the barbershop music community in a leadership role. He serves as the chair of the Membership Committee of Parkside Harmony, a position that allows him to contribute to the organization's growth and development. He considers it an honor to hold this position and is dedicated to fulfilling his responsibilities with enthusiasm and dedication.",
    photoUrl: "/images/rcrider.jpg"
  },
  {
    id: "secretary",
    name: "Nikki Burkhardt",
    title: "Secretary",
    bio: "Nikki has a rich background in barbershop music, with 17 years of experience. She currently sings Lead with Parkside Melody and Tenor with her quartet, Midnight Society, as well as with her Sweet Adelines Chorus, Valley Forge. Her musical journey began at the tender age of 8, when she performed with the Delaware Children's Chorus, Delaware All-State Chorus, and the National Children's Chorus. She also engaged in local community theater productions.\n\nNikki is a founding member of the Celtic Fusion band Mythica, where she contributed her vocal talents as well as played the flute, Irish whistle, and hand percussion. From 2006 to 2012, Mythica toured across the US, sharing the stage with renowned artists like The Spin Doctors and Sister Hazel.\n\nNikki's formal music education includes a Certificate of Music from the Wilmington Music School (now known as the Music School of Delaware), where she studied voice under Elliot Jones. Her skills extend beyond singing, as she has professional training in dance, costuming, lighting, and stage makeup. She has also worked professionally at the Three Little Bakers Dinner Theater.\n\nIn addition to her musical pursuits, Nikki has an impressive academic and professional background in engineering. She holds a Bachelor of Environmental Engineering degree and a Master of Civil Engineering degree from the University of Delaware. She is a licensed Professional Engineer and a Board Certified Environmental Engineer. Nikki works as a Landfill Gas Engineer for the Delaware Solid Waste Authority, where she is responsible for regulatory compliance. She is also the incoming Director of the Landfill Gas and Biogas Technical Division of the Solid Waste Association of North America.",
    photoUrl: "/images/nikkib.jpg"
  },
  {
    id: "treasurer",
    name: "Tom Nisbet",
    title: "Treasurer",
    bio: "Tom Nisbet is a seasoned software engineering consultant and an accomplished entrepreneur. He is the founder of Visual Networks, a network analysis company that he successfully grew from a small team of five employees to a large organization with over 500 staff members.\n\nIn addition to his professional career in software engineering, Tom is deeply involved in community music initiatives. He serves on the Board of the Sherwood Community Chamber Choir, contributing to the choir's strategic direction and growth. Tom also holds a key role in the Barbershop Harmony Society, serving as the Events Treasurer for the Mid-Atlantic District. This position allows him to combine his financial acumen with his passion for music.\n\nTom's expertise in software engineering is backed by solid academic credentials. He holds a Master of Science degree in Computer Engineering from Johns Hopkins University, a renowned institution known for its rigorous engineering programs. Prior to that, he earned a Bachelor of Science degree in Computer Science from Frostburg State University. These qualifications have undoubtedly played a significant role in his successful career and contributions to the field of software engineering.",
    photoUrl: "/images/tnisbet.png"
  }
];

const boardMembersAtLarge = [
  {
    id: "board-member-1",
    name: "Drew Xentaras",
    title: "Board Member at Large",
    bio: "Drew Xentaras has been actively singing with Parkside Harmony since 2018 where he serves as the Performance Attire Manager for the chorus. Drew caught the barbershop \"bug\" in 1983 when he was a junior in high school where he sang with the Centennial State Chorus in Sterling, CO. After moving to Lancaster, PA, Drew sang with the Red Rose Chorus under the direction of Dr. Jay Butterfield.\n\nDrew achieved his Bachelor of Arts degree in 1988 from Hastings College majoring in Theatre Arts, Speech Communication, and Secondary Education. Since 1989, Drew has been employed with American Airlines, Inc. as an international flight attendant where he met his wife, Laura and is based at New York's JFK International Airport.\n\nDrew is father to two adult sons, Christian and Daniel and grandfather to his precious Lucy.\n\nDrew is so blessed to be a Parkside Board Member and will do all in his power to serve well.",
    photoUrl: "/images/drewx.jpg"
  },
  {
    id: "board-member-2",
    name: "Sally Galloway",
    title: "Board Member at Large",
    bio: "Sally's barbershop journey started early, humming the baritone line along to her mom's quartet rehearsals before officially joining Sweet Adelines at 13 and later BHS in 2013. With a BA in Music, a master's in Music Education, and decades as a massage therapist and certified life/health coach, she blends her love of harmony, empowerment, and coaching to help others find their voices—both in singing and in life. She has directed and taught choirs, private voice lessons, and mentored small choruses in building their identity, leadership, and musical excellence.\n\nSally has sung with 15 barbershop choruses and a dozen quartets across the US and England, also serving as a certified director, section leader, assistant director, and choreography coach. She helped prepare the Pride of Baltimore Chorus for the International stage, directs the BHS Old Dominion Chorus, and currently sings bass while serving on the Performance Team for Parkside Melody. She is also VP of the Central Division of the Mid-Atlantic District and a faculty member at Harmony College East, where she teaches yoga for singers and the psychological aspects of performance. A certified professional coach since 2001, she helps people nationwide manage stress, anxiety, and depression, while her international private practice specializes in helping singers overcome performance anxiety, boost confidence, and make music more fun.\n\nPassionate about personal growth, Sally thrives on helping people unlock their confidence—whether through singing, coaching, or personal transformation. She's fascinated by mind-body connections, energy work, and positive psychology, which influence her coaching style. A lifelong teacher and creator, she designs workshops, retreats, and frameworks to help others learn and thrive. She also secretly loves geeking out over details, from chord analysis to foreign-language pronunciation to which spices enhance foods' flavors and healing properties. With her warm, energetic, and supportive approach, Sally makes every interaction an adventure in growth, harmony, and joy.",
    photoUrl: "/images/sallyg.png"
  },
  {
    id: "board-member-3",
    name: "Tim Dawson",
    title: "Board Member at Large",
    bio: "Tim is relatively new to Barbershop, having joined Parkside Harmony during the pandemic via Zoom in 2021, but he has been singing since the early days as a pastor's kid. He has a degree in Music Education from Messiah University and an M.Ed in Higher Education from The Pennsylvania State University. He has been a member of the Harrisburg Singers, worship leader and church musician in the Harrisburg area for many years but has recently moved to Silver Spring, MD.\n\nBy day, he is a Strategic Business Advisor for Ellucian, providing software solutions for student success for colleges & universities. He has worked as an Enrollment Manager for both Messiah University and Harrisburg University of Science & Technology prior to joining Ellucian.\n\nIn addition to music and student success, he loves Walt Disney World and is a collector of memorabilia from the early days of the park which opened the year he was born. He is drawn to the way they tell stories and is pleased to be able to do that everyday at work and thru music with Parkside!",
    photoUrl: "/images/timd.JPG"
  },
  {
    id: "board-member-4",
    name: "Don Staffin",
    title: "Board Member at Large",
    bio: "Don has a long-standing history with a cappella choruses, having been involved in singing, directing, managing, and arranging for them for many years. His passion for a cappella music is shared with his wife, Chris, who is also a member of Parkside. Together, they co-directed their a cappella group at Cornell University.\n\nIn 2011, Don joined the Barbershop Harmony Society and has since made significant contributions to the organization. He currently serves as the VP/Artistic Director of Somerset Hills Harmony in New Jersey. Don has been a trailblazer in promoting inclusivity within the society, pioneering the \"Everyone in Harmony\" initiative and creating one of the early mixed chapters within the Barbershop Harmony Society.\n\nBeyond his musical endeavors, Don is a global executive in e-commerce for the commercial maritime industry. Despite his demanding professional role, he also finds time to work with youth in music, having coached, arranged, and directed a cappella in the Bridgewater-Raritan School District since 2007.\n\nDon's creative output extends to publishing as well. He has published more than thirty a cappella arrangements, showcasing his talent for musical composition. He is also a published book author, further demonstrating his diverse range of skills.\n\nIn addition to his professional and musical accomplishments, Don has a unique set of interests and talents. He is father of four grown daughters (including a set of triplets), and a \"certified cow whisperer\". He has also showcased his sense of humor and ability to entertain as a performer and producer of clean comedy shows, having appeared on stage on three continents.",
    photoUrl: "/images/dons.jpeg"
  }
];

export default function LeadershipPage() {
  return (
    <PageTransition>
      <div className="bg-white">
        <HeroSection
          title="Our Leadership"
          subtitle="Meet the dedicated team guiding Parkside's musical excellence and organizational success."
          imagePath="/images/leadership-hero.jpg"
          imageAlt="Parkside Leadership Team"
        />

        {/* Music Leadership Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Music Leadership
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {musicLeadership.map((leader) => (
                  <LeadershipProfile key={leader.name} {...leader} />
                ))}
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Board Members Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Board Members
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
                {boardMembers.map((member) => (
                  <LeadershipProfile key={member.id} {...member} />
                ))}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Board Members at Large
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {boardMembersAtLarge.map((member) => (
                  <LeadershipProfile key={member.id} {...member} />
                ))}
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Get Involved Section */}
        <section className="py-16" aria-labelledby="get-involved-title">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="text-center">
                <h2 id="get-involved-title" className="text-3xl font-bold text-gray-900 mb-6">
                  Want to Get Involved?
                </h2>
                <p className="text-lg text-gray-700 mb-8">
                  Meet the dedicated individuals guiding Parkside Harmony and Parkside Melody. 
                  Our leadership team is composed of experienced members committed to musical excellence, 
                  chapter growth, and fostering a welcoming community for all singers. They work tirelessly 
                  behind the scenes to ensure the smooth operation of our choruses and the success of our events. 
                  Get to know the people leading Parkside&apos;s vibrant musical journey.
                </p>
                <a
                  href="/join"
                  className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
                  role="button"
                >
                  Join Our Chorus
                </a>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </div>
    </PageTransition>
  );
} 