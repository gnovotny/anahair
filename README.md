[![Ana Hair](https://www.ananovotny.ch/icons/android-chrome-192x192.png)](https://www.ananovotny.ch)

## Description

A [website](https://www.ananovotny.ch) for a hair salon in Zurich Seefeld


## Composition

Employed libraries include:

- [React](https://nextjs.org) -> front-end JavaScript library
- [Next.js](https://nextjs.org) -> web development framework for react
- [Tailwind](https://tailwindcss.com/) -> utility-first CSS framework
- [next-i18next](https://github.com/i18next/next-i18next) -> [i18next](https://www.i18next.com/) and [react-i18next](https://github.com/i18next/react-i18next) under the hood
- [Zustand](https://github.com/pmndrs/zustand) -> state-management solution for react
- [Framer Motion](https://www.framer.com/motion/) -> animation library for react
- [Lenis](https://github.com/studio-freight/lenis) -> smooth scroll solution
- [react-three-fiber](https://github.com/pmndrs/react-three-fiber) -> react renderer for [Three.js](https://threejs.org/)

## Features

- custom WebGL frag shader [frag shader](./src/components/layout/views/portal/scene/shaders/fragment.glsl)
- sporadic use of pure CSS for non-trivial animations
- tracks DOM elements and draws Three.js objects in their place using [r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig)
- Opinionated lint config:
  - no semicolons
  - jsx: single attribute per line


## TODO

- [ ] portal element: fix faux-3d effect on pointer move
- [ ] footer element: mobile browser navigation bars scrolling issue
- [ ] performance improvements
- [ ] refactor frag shader

## Running Locally

This application requires Node.js v16.13+.

```bash
git clone https://github.com/gnovotny/anahair.git
cd anahair
yarn install
yarn dev
```
## Related

- Alternative design variant (early prototype): [https://anahair-proto-2023-alt-design.vercel.app/](https://anahair-proto-2023-alt-design.vercel.app/)

## Acknowledgements

- Modded version of [r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig) included in the source code

## Authors

This project was developed – and is curated and maintained – by:

- [gnovotny](https://github.com/gnovotny) – [Website](https://gnovotny.ch)

## License

[The MIT License](https://opensource.org/licenses/MIT)

1. You are free to use this code but please don't just copy it blindly
2. Remove all personal information and commercial fonts
3. Crediting the author is appreciated
4. Be kind and help others learn

