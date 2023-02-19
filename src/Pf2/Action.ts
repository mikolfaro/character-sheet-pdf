export default class Action {
  readonly name: string;
  readonly actions: number;
  readonly reaction: boolean;
  readonly freeAction: boolean;
  readonly traits: string[];
  readonly page: string | null;
  readonly description: string;
  readonly trigger: string;
  readonly oncePerDay: string;
  readonly requirements: string;

  constructor(
    name: string,
    actions: number,
    reaction: boolean = false,
    freeAction: boolean = false,
    traits: string[] = [],
    page: string = null,
    description: string = null,
    trigger: string = null,
    oncePerDay: string = null,
    requirements: string = null,
  ) {
    this.name = name;
    this.actions = actions;
    this.reaction = reaction;
    this.freeAction = freeAction;
    this.traits = traits;
    this.page = page;
    this.description = description;
    this.trigger = trigger;
    this.oncePerDay = oncePerDay;
    this.requirements = requirements;
  }
}
