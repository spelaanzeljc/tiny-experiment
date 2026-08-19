export const testFlowerDto1 = {
  id: 1,
  name: "Flower One",
  latin_name: "Flower One - Latin",
  sightings: 12,
  profile_picture: "/path/to/flower-one.jpg",
  favorite: false,
};

export const testFlowerDto2 = {
  id: 2,
  name: "Flower Two",
  latin_name: "Flower Two - Latin",
  sightings: 1,
  profile_picture: "/path/to/flower-two.jpg",
  favorite: true,
};

export const testFlowerApiResponse = {
  flowers: [testFlowerDto1, testFlowerDto2],
  meta: {
    pagination: {
      current_page: 1,
      next_page: 2,
      prev_page: null,
      total_pages: 2,
    },
  },
};
