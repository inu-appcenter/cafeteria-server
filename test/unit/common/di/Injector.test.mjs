/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Global App Center <potados99@gmail.com>
 *
 * INU Cafeteria is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * INU Cafeteria is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import Injector from '../../../../lib/common/di/Injector';

class NoClass {
}

class TestClass {
  say() {
    return 'hi';
  }
}

class TestClassWithDependency {
  constructor(dependency) {
    if (!dependency) {
      throw new Error('Cannot initialize class without dependency');
    }
    this.dependency = dependency;
  }
  say() {
    return this.dependency.say();
  }
}

describe('# Initialize', () => {
  it('should fail with null declaration', async () => {
    const injector = new Injector();

    const declarations = null;

    await expect(injector.init(declarations)).rejects.toThrow();
  });

  it('should fail with wrong declaration: null', async () => {
    const injector = new Injector();

    const declarations = [
      {
        create: null,
        as: null,
      },
    ];

    await expect(injector.init(declarations)).rejects.toThrow();
  });

  it('should fail with wrong declaration: non-function', async () => {
    const injector = new Injector();

    const declarations = [
      {
        create: 1,
        as: 2,
      },
    ];

    await expect(injector.init(declarations)).rejects.toThrow();
  });

  it('should fail with unknown dependency', async () => {
    const injector = new Injector();

    const declarations = [
      {
        create: async (r) => new TestClassWithDependency(await r(TestClass)),
        as: TestClassWithDependency,
      },
    ];

    await expect(injector.init(declarations)).rejects.toThrow();
  });

  it('should fail with constructor exception', async () => {
    const injector = new Injector();

    const declarations = [
      {
        create: async (r) => new TestClassWithDependency(),
        as: TestClassWithDependency,
      },
    ];

    await expect(injector.init(declarations)).rejects.toThrow();
  });

  it('should success init: array', async () => {
    const injector = new Injector();

    const declarations = [
      {
        create: async (r) => new TestClassWithDependency(await r(TestClass)),
        as: TestClassWithDependency,
      },
      {
        create: async (r) => new TestClass(),
        as: TestClass,
      },
    ];

    await expect(injector.init(declarations)).resolves.not.toThrow();

    const instance = injector.resolve(TestClassWithDependency);

    expect(instance).toBeInstanceOf(TestClassWithDependency);
    expect(instance.say()).toBe('hi');
  });

  it('should success init: single', async () => {
    const injector = new Injector();

    const declarations = {
        create: async (r) => new TestClass(),
        as: TestClass,
    };

    await expect(injector.init(declarations)).resolves.not.toThrow();

    const instance = injector.resolve(TestClass);

    expect(instance).toBeInstanceOf(TestClass);
    expect(instance.say()).toBe('hi');
  });
});

describe('# Resolve', () => {
  it('should fail with null parameter', async () => {
    const injector = await getInjector();

    expect(() => injector.resolve(null)).toThrow();
  });

  it('should fail with invalid parameter', async () => {
    const injector = await getInjector();

    expect(() => injector.resolve(NoClass)).toThrow();
  });

  it('should get instance', async () => {
    const injector = await getInjector();

    const instance = injector.resolve(TestClassWithDependency);

    expect(instance.say()).toBe('hi');
  });
});

describe('# Mock', () => {
  it('should fail with null classType', async () => {
    const injector = await getInjector();

    expect(() => injector.mock(null, 1)).toThrow();
  });

  it('should not fail with null instance', async () => {
    const injector = await getInjector();

    expect(() => injector.mock(TestClass, 1)).not.toThrow();
  });

  it('should work', async () => {
    const injector = await getInjector();

    injector.mock(TestClassWithDependency, {
      say: function() {
        return 'haha!';
      },
    });

    const mockedInstance = injector.resolve(TestClassWithDependency);

    expect(mockedInstance.say()).toBe('haha!');
  });
});

describe('# Mock once', () => {
  it('should fail with null classType', async () => {
    const injector = await getInjector();

    expect(() => injector.mockOnce(null, 1)).toThrow();
  });

  it('should not fail with null instance', async () => {
    const injector = await getInjector();

    expect(() => injector.mockOnce(TestClass, 1)).not.toThrow();
  });

  it('should work', async () => {
    const injector = await getInjector();

    injector.mockOnce(TestClassWithDependency, {
      say: function() {
        return 'haha!';
      },
    });

    expect(injector.resolve(TestClassWithDependency).say()).toBe('haha!');
    expect(injector.resolve(TestClassWithDependency).say()).toBe('hi');
    expect(injector.resolve(TestClassWithDependency).say()).toBe('hi');
  });
});

describe('# Mock clear', () => {
  it('should fail with null classType', async () => {
    const injector = await getInjector();

    expect(() => injector.mockClear(null, 1)).toThrow();
  });

  it('should not fail with null instance', async () => {
    const injector = await getInjector();

    expect(() => injector.mockClear(TestClass, 1)).not.toThrow();
  });

  it('should work', async () => {
    const injector = await getInjector();

    expect(injector.resolve(TestClassWithDependency).say()).toBe('hi');
    expect(injector.resolve(TestClassWithDependency).say()).toBe('hi');

    injector.mock(TestClassWithDependency, {
      say: function() {
        return 'haha!';
      },
    });

    expect(injector.resolve(TestClassWithDependency).say()).toBe('haha!');
    expect(injector.resolve(TestClassWithDependency).say()).toBe('haha!');

    injector.mockClear(TestClassWithDependency);

    expect(injector.resolve(TestClassWithDependency).say()).toBe('hi');
    expect(injector.resolve(TestClassWithDependency).say()).toBe('hi');
  });
});

async function getInjector() {
  const injector = new Injector();

  const declarations = [
    {
      create: async (r) => new TestClassWithDependency(await r(TestClass)),
      as: TestClassWithDependency,
    },
    {
      create: async (r) => new TestClass(),
      as: TestClass,
    },
  ];
  await expect(injector.init(declarations)).resolves.not.toThrow();

  return injector;
}
