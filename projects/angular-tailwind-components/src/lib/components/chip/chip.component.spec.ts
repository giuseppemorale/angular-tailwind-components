import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindChip } from './chip.component';

@Component({
  imports: [TailwindChip],
  template: `<tailwind-chip>Angular</tailwind-chip>`
})
class ChipHost {}

@Component({
  imports: [TailwindChip],
  template: `<tailwind-chip [disabled]="true">Angular</tailwind-chip>`
})
class DisabledChipHost {}

@Component({
  imports: [TailwindChip],
  template: `<tailwind-chip [removable]="false">Angular</tailwind-chip>`
})
class StaticChipHost {}

@Component({
  imports: [TailwindChip],
  template: `<tailwind-chip color="primary">Angular</tailwind-chip>`
})
class PrimaryChipHost {}

describe('TailwindChip', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({ imports: [ChipHost] }).compileComponents();
    const fixture = TestBed.createComponent(ChipHost);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render projected content', async () => {
    await TestBed.configureTestingModule({ imports: [ChipHost] }).compileComponents();
    const fixture = TestBed.createComponent(ChipHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Angular');
  });

  it('should emit removed when remove button is clicked', async () => {
    await TestBed.configureTestingModule({ imports: [ChipHost] }).compileComponents();
    const fixture = TestBed.createComponent(ChipHost);
    fixture.detectChanges();

    const chip = fixture.debugElement.children[0].componentInstance as TailwindChip;
    const spy = vi.fn();
    chip.removed.subscribe(spy);

    fixture.nativeElement.querySelector('button')?.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not emit removed when disabled', async () => {
    await TestBed.configureTestingModule({ imports: [DisabledChipHost] }).compileComponents();
    const fixture = TestBed.createComponent(DisabledChipHost);
    fixture.detectChanges();

    const chip = fixture.debugElement.children[0].componentInstance as TailwindChip;
    const spy = vi.fn();
    chip.removed.subscribe(spy);

    fixture.nativeElement.querySelector('button')?.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should hide remove button when removable is false', async () => {
    await TestBed.configureTestingModule({ imports: [StaticChipHost] }).compileComponents();
    const fixture = TestBed.createComponent(StaticChipHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('should apply color classes', async () => {
    await TestBed.configureTestingModule({ imports: [PrimaryChipHost] }).compileComponents();
    const fixture = TestBed.createComponent(PrimaryChipHost);
    fixture.detectChanges();
    const chip = fixture.nativeElement.querySelector('span');
    expect(chip?.className).toContain('bg-primary-100');
  });
});
