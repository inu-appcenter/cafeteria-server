import Injector from '#common/di/Injector';

class FullyStandAlone {
  constructor() {
  }
}

class HalfStandAlone {
  constructor(standAlone) {
  }
}

class Dependent {
  constructor(standAlone) {
  }
  run() {
    console.log('yeah!');
  }
}


const injector = new Injector();

injector.init([
  {
    create: async (r) => new Dependent(r(HalfStandAlone)),
    as: Dependent,
  },
  {
    create: async (r) => new HalfStandAlone(r(FullyStandAlone)),
    as: HalfStandAlone,
  },
  {
    create: async (r) => new FullyStandAlone(),
    as: FullyStandAlone,
  },
]).then(() => {
  injector.resolve(Dependent).run();
});

