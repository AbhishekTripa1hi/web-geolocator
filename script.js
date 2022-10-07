'use strict';
//API used https://restcountries.com/v2/

const countriesContainer = document.querySelector('.countries');
const imageContainer = document.querySelector('.images');

const btn = document.querySelector('.btn-country');

///////////////////////////////////////

const renderCountryData = function (data, className = '') {
  const html = `<article class="country ${className}">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${Number.parseInt(
              +data.population / 1000000
            )} million</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].name
            }</p>
          </div>
        </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

/////////////////////////////////////////////

const getCountryData = function (countryCode) {
  return fetch(`https://restcountries.com/v2/alpha/${countryCode}`)
    .then(response => response.json())
    .then(data => {
      if (!data?.name) throw new Error('country code not found');
      renderCountryData(data);
    })
    .catch(err => Promise.reject(err));
};

const getLocation = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = function () {
  return getLocation()
    .then(position => {
      return fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en `
      );
    })
    .then(response => {
      if (response.status === 403) throw new Error('Too many requests');
      return response.json();
    })
    .then(data => {
      //console.log(data);
      if (data?.localityInfo?.informative?.length > 0) {
        console.log('You are in: ');
        const arr = data.localityInfo.informative;
        let location = '';
        for (let i = arr.length - 1; i > -1; i--) {
          if (i) location = location.concat(arr[i].name, ', ');
          else location = location.concat(arr[i].name);
        }

        console.log(location);
        if (!data.countryCode) Promise.reject('country code not found');

        getCountryData(data.countryCode);
        return data;
      }
      return Promise.reject('Not found');
    })
    .catch(err => err);
};

btn.addEventListener('click', () => {
  whereAmI().catch(err => console.log(err));
});

/////////////////////////////////////////////
const wait = function (time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};

const createImage = function (path) {
  return new Promise(function (resolve, reject) {
    const elem = document.createElement('img');
    elem.src = path;
    elem.classList.add('images');
    elem.classList.add('parallel');
    elem.addEventListener('load', () => {
      const lastImageChild = imageContainer.lastChild;
      if (!!lastImageChild) imageContainer.removeChild(lastImageChild);

      imageContainer.appendChild(elem);
      resolve(elem);
    });

    elem.addEventListener('error', () => reject('error in loading image'));
  });
};

const loadAndPause = async () => {
  try {
    const img = await createImage(`/img/img-1.jpg`);
    await wait(2000);

    const img2 = await createImage(`/img/img-2.jpg`);
    await wait(2000);

    const img3 = await createImage(`/img/img-3.jpg`);
    await wait(2000);

    const lastImageChild = imageContainer.lastChild;
    if (!!lastImageChild) imageContainer.removeChild(lastImageChild);
  } catch (err) {
    console.log(err);
  }
};

loadAndPause();

/////////////////////////////////////////////
// const wait = function (time) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, time);
//   });
// };

// const createImage = function (path) {
//   return new Promise(function (resolve, reject) {
//     const elem = document.createElement('img');
//     elem.src = path;
//     elem.classList.add('images');
//     elem.addEventListener('load', () => {
//       imageContainer.appendChild(elem);
//       imageContainer.style.opacity = 1;
//       resolve(elem);
//     });

//     elem.addEventListener('error', () => reject('error in loading image'));
//   });
// };

// createImage(`/img/img-1.jpg`)
//   .then(img => {
//     return wait(2000)
//       .then(() => {
//         console.log(img);
//         img.style.display = 'none';
//       })
//       .catch(err => err);
//   })
//   .then(() => createImage(`/img/img-2.jpg`))
//   .then(img => {
//     return wait(2000)
//       .then(() => {
//         console.log(img);
//         img.style.display = 'none';
//       })
//       .catch(err => err);
//   })
//   .catch(err => console.log(err, 'rejected'));
/////////////////////////////////////////////

// const whereAmI2 = async function () {
//   try {
//     const position = await getLocation();
//     if (!position?.coords?.latitude || !position?.coords?.longitude)
//       throw new Error('lat/lng not found');

//     const res = await fetch(
//       `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en `
//     );

//     const data = await res.json();
//     if (!data?.countryCode) throw new Error('country code not found');
//     await getCountryData(data.countryCode);
//   } catch (err) {
//     console.log(err);
//     return Promise.reject(err);
//   }
// };

//const url = `https://countriesnow.space/api/v0.1/countries/capital`;

// const getCountryCapital = async function (countryNameSmall) {
//   try {
//     const res = [];

//     for (let i = 0; i < countryNameSmall.length; i++) {
//       res.push(
//         fetch(url, {
//           method: 'POST',
//           referrerPolicy: 'no-referrer',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ country: countryNameSmall[i] }),
//         })
//       );
//     }
//     const responseArr = await Promise.all(res);

//     for (let i = 0; i < responseArr.length; i++)
//       responseArr[i] = responseArr[i].json();

//     const dataArr = await Promise.all(responseArr);

//     //console.log(dataArr);

//     for (let i = 0; i < dataArr.length; i++) {
//       if (dataArr[i]?.error === false && dataArr[i]?.data?.capital)
//         console.log(dataArr[i].data.capital);
//       else console.log('some error');
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

// getCountryCapital(['nigeria', 'inia', 'germany']);
// const prmTimeout = new Promise(function (resolve, _) {
//   setTimeout(() => resolve('timeout'), 4000);
// });

// (async function () {
//   const res = await Promise.race([
//     fetch(url, {
//       method: 'POST',
//       referrerPolicy: 'no-referrer',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ country: 'india' }),
//     }),
//     fetch(url, {
//       method: 'POST',
//       referrerPolicy: 'no-referrer',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ country: 'canada' }),
//     }),
//     fetch(url, {
//       method: 'POST',
//       referrerPolicy: 'no-referrer',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ country: 'portugal' }),
//     }),
//     prmTimeout,
//   ]);

//   console.log(res);
// })();

// const loadAll = async function (arrPaths) {
//   try {
//     imageContainer.style.opacity = 1;
//     let imgs = [];
//     for (let i = 0; i < arrPaths.length; i++) {
//       imgs.push(createImage(arrPaths[i]));
//     }
//     console.log(imgs);
//     imgs = await Promise.all(imgs);
//     console.log(imgs);
//   } catch (err) {
//     console.log(err);
//   }
// };
// loadAll(['/img/img-1.jpg', '/img/img-2.jpg', '/img/img-3.jpg']);
