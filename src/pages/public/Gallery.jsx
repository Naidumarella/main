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
    <div className="min-h-screen bg-gray-100 px-5 md:px-8 py-10">
      <h2 className="text-5xl font-bold text-gray-900 mb-10 text-center">
        Gallery
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-56 object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;