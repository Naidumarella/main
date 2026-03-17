function Gallery() {
  const galleryItems = [
    {
      id: 1,
      title: "Batting Practice",
      img: "https://commons.wikimedia.org/wiki/Special:FilePath/Batting_practice_at_Maghull_Cricket_Club_-_geograph.org.uk_-_491923.jpg",
    },
    {
      id: 2,
      title: "Cricket Coaching Nets",
      img: "https://commons.wikimedia.org/wiki/Special:FilePath/Cricket_coaching_at_Freebody_Oval_nets.jpg",
    },
    {
      id: 3,
      title: "Practice Nets",
      img: "https://commons.wikimedia.org/wiki/Special:FilePath/Epping_Foresters_Cricket_Club_practice_nets_1.jpg",
    },
    {
      id: 4,
      title: "Batting Practice Ground",
      img: "https://commons.wikimedia.org/wiki/Special:FilePath/Practice_nets_at_Fenner%27s_Field_ground%2C_Cambridge_University_Cricket_Club%2C_England_01.jpg",
    },
    {
      id: 5,
      title: "Classic Batting Practice",
      img: "https://commons.wikimedia.org/wiki/Special:FilePath/Chris_Read_bat.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-950 via-green-900 to-emerald-700 text-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="uppercase tracking-[0.3em] text-sm font-semibold text-green-300 mb-4">
            Cricket Academy
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-5">Gallery</h1>

          <p className="max-w-3xl mx-auto text-base md:text-xl text-white/85 leading-8">
            Explore our academy training atmosphere, practice nets, batting
            sessions and professional cricket development environment.
          </p>
        </div>
      </section>

      {/* Intro Cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl mb-4">
              🏏
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Skill Sessions
            </h3>
            <p className="text-gray-600 leading-7">
              Focused batting, bowling and fielding training for all player
              categories.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl mb-4">
              🎯
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Practice Nets
            </h3>
            <p className="text-gray-600 leading-7">
              Dedicated net sessions for technical improvement and match
              preparation.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
            <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center text-2xl mb-4">
              📸
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Academy Moments
            </h3>
            <p className="text-gray-600 leading-7">
              A glimpse into our daily coaching sessions and player development
              journey.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-green-700 font-semibold uppercase tracking-wider mb-2">
              Photo Collection
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Training & Practice Gallery
            </h2>
          </div>

          <p className="text-gray-600 max-w-2xl leading-7">
            These images showcase our cricket coaching setup, batting practice
            areas, training nets and academy environment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-[28px] overflow-hidden border border-gray-200 shadow-md hover:shadow-2xl transition duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-64 md:h-72 object-cover group-hover:scale-110 transition duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <span className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                    Photo
                  </span>
                </div>

                <p className="text-gray-600 mt-3 leading-7">
                  Professional academy practice environment and player
                  development activity.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Highlight */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-[32px] text-white p-8 md:p-12 shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="uppercase tracking-[0.25em] text-sm font-semibold text-green-100 mb-3">
                Academy Experience
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Every Session Builds Confidence
              </h2>
              <p className="text-white/90 leading-8">
                Our gallery reflects the discipline, effort and professional
                practice structure that help students grow into strong
                cricketers.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-5 text-center">
                <h3 className="text-3xl font-bold">500+</h3>
                <p className="mt-2 text-white/85">Students Trained</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-5 text-center">
                <h3 className="text-3xl font-bold">50+</h3>
                <p className="mt-2 text-white/85">Matches Played</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-5 text-center">
                <h3 className="text-3xl font-bold">10+</h3>
                <p className="mt-2 text-white/85">Expert Coaches</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-5 text-center">
                <h3 className="text-3xl font-bold">8+</h3>
                <p className="mt-2 text-white/85">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Gallery;