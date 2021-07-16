export default abstract class Entity<EntityT> {
  constructor(properties: Partial<EntityT>) {
    Object.assign(this, properties) as unknown as EntityT;
  }

  toString() {
    return JSON.stringify(this);
  }
}
